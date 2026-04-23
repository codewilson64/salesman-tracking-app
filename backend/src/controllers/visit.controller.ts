import type { Request, Response } from "express";
import { areasTable, customersTable, salesmenTable, visitsTable, productsTable, transactionsTable, transactionItemsTable, usersTable } from "../db/schemas";
import { db } from "..";
import { and, eq, gte, isNull, lte } from "drizzle-orm";

export const createVisit = async (req: Request, res: Response) => {
  try {
    const { areaId, customerId, checkInImage, checkInImageId } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const companyId = user.companyId;

    // basic validation
    if (!areaId || !customerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // validate area belongs to company
    const [area] = await db
      .select()
      .from(areasTable)
      .where(
        and(
          eq(areasTable.id, areaId),
          eq(areasTable.companyId, companyId)
        )
      );

    if (!area) {
      return res.status(400).json({
        message: "Invalid area",
      });
    }

    // validate customer belongs to company + area
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(
        and(
          eq(customersTable.id, customerId),
          eq(customersTable.companyId, companyId),
          eq(customersTable.areaId, areaId)
        )
      );

    if (!customer) {
      return res.status(400).json({
        message: "Invalid customer",
      });
    }

    // OPTIONAL: prevent multiple active visits
    const [activeVisit] = await db
      .select()
      .from(visitsTable)
      .where(
        and(
          eq(visitsTable.salesmanId, user.userId),
          isNull(visitsTable.checkOutAt)
        )
      );

    if (activeVisit) {
      return res.status(400).json({
        message: "You still have an active visit. Please check-out first.",
      });
    }

    // insert visit (check-in)
    const [visit] = await db
      .insert(visitsTable)
      .values({
        companyId,
        salesmanId: user.userId,
        areaId,
        customerId,
        status: "check-in",
        checkInImage,
        checkInImageId,
      })
      .returning();

    return res.status(201).json({
      message: "Check-in successful",
      data: {
        visit,
        customer, // for autofill on frontend
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create visit",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const checkoutVisit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { result, notes, transactionType, products, orderBy, paymentType, paidAmount } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validResults = ["new order", "follow-up", "shop closed"];

    if (!result || !validResults.includes(result)) {
      return res.status(400).json({ message: "Invalid visit result" });
    }

    if (!notes) {
      return res.status(400).json({ message: "Please provide notes" });
    }

    if (result === "new order") {
      if (!transactionType) {
        return res.status(400).json({
          message: "Transaction type is required for new order",
        });
      }

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          message: "Products are required for new order",
        });
      }
    }

    if (transactionType === "cash") {
      if (!paymentType) {
        return res.status(400).json({
          message: "Payment type is required for cash transaction",
        });
      }
    }

    const data = await db.transaction(async (tx) => {
      // find active visit
      const [visit] = await tx
        .select()
        .from(visitsTable)
        .where(
          and(
            eq(visitsTable.id, id),
            eq(visitsTable.salesmanId, user.userId)
          )
        );

      if (!visit) {
        throw new Error("Visit not found");
      }

      if (visit.status !== "check-in") {
        throw new Error("Visit is not active");
      }

      // update visit
      const [updatedVisit] = await tx
        .update(visitsTable)
        .set({
          visitResult: result,
          notes,
          orderBy,
          checkOutAt: new Date(),
          status: "check-out",
        })
        .where(eq(visitsTable.id, visit.id))
        .returning();

      let transaction = null;

      if (result === "new order") {
        // ✅ calculate totals
        const totals = products.reduce(
          (acc: any, p: any) => {
            const price = Number(p.price);
            const quantity = Number(p.quantity);
            const discount = Number(p.discount || 0);

            const subtotal = price * quantity;
            const totalAfterDiscount = Math.max(subtotal - discount, 0);

            acc.totalAmount += subtotal;
            acc.totalDiscount += discount;
            acc.finalAmount += totalAfterDiscount;

            return acc;
          },
          {
            totalAmount: 0,
            totalDiscount: 0,
            finalAmount: 0,
          }
        );

        let paymentStatus: "paid" | "partial" | "unpaid" = "unpaid";
        let finalPaidAmount = 0;
        let finalPaymentType = paymentType || null;

        if (transactionType === "cash") {
          paymentStatus = "paid";
          finalPaidAmount = totals.finalAmount;
        } else {
          const paid = Number(paidAmount || 0);
          finalPaidAmount = paid;

          if (paid === 0) paymentStatus = "unpaid";
          else if (paid < totals.finalAmount) paymentStatus = "partial";
          else paymentStatus = "paid";

          // no payment yet → no method
          if (paid === 0) {
            finalPaymentType = null;
          }
        }

        // ✅ create transaction
        const [newTransaction] = await tx
          .insert(transactionsTable)
          .values({
            companyId: user.companyId,
            visitId: visit.id,
            transactionType,

            totalAmount: totals.totalAmount.toString(),
            totalDiscount: totals.totalDiscount.toString(), 
            finalAmount: totals.finalAmount.toString(),    
            
            paymentStatus,
            paidAmount: finalPaidAmount.toString(),
            paymentType: finalPaymentType,

            remainingAmount: (
              totals.finalAmount - finalPaidAmount
            ).toString(),
          })
          .returning();

        if (!newTransaction) {
          throw new Error("Failed to create transaction");
        }

        // ✅ insert items with discount
        await tx.insert(transactionItemsTable).values(
          products.map((p: any) => {
            const price = Number(p.price);
            const quantity = Number(p.quantity);
            const discount = Number(p.discount || 0);

            const subtotal = price * quantity;
            const totalAfterDiscount = Math.max(subtotal - discount, 0);

            return {
              transactionId: newTransaction.id,
              productId: p.productId,
              quantity,
              price: price.toString(),
              discount: discount.toString(),
              totalAfterDiscount: totalAfterDiscount.toString(), 
            };
          })
        );

        transaction = newTransaction;
      }

      return {
        visit: updatedVisit,
        transaction,
      };
    });

    return res.status(200).json({
      message: "Check-out successful",
      data,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to check-out visit",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllVisits = async (req: Request, res: Response) => {
  try {
    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const { startDate, endDate } = req.query;

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let conditions = [];

    /* ================= BASE CONDITION ================= */

    if (user.role === "salesman") {
      const [salesman] = await db
        .select()
        .from(salesmenTable)
        .where(eq(salesmenTable.userId, user.userId));

      if (!salesman) {
        return res.status(400).json({ message: "Salesman not found" });
      }

      conditions.push(eq(visitsTable.salesmanId, user.userId));
    }

    conditions.push(eq(visitsTable.companyId, user.companyId));

    /* ================= DATE FILTER ================= */

    if (startDate) {
      conditions.push(gte(visitsTable.checkInAt, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(visitsTable.checkInAt, new Date(endDate as string)));
    }

    /* ================= QUERY ================= */

    const visits = await db
      .select({
        // visit info
        id: visitsTable.id,
        checkInAt: visitsTable.checkInAt,
        checkOutAt: visitsTable.checkOutAt,
        visitResult: visitsTable.visitResult,
        notes: visitsTable.notes,
        approvalStatus: visitsTable.approvalStatus,
        createdAt: visitsTable.createdAt,

        // customer info
        customerId: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        address: customersTable.address,

        // area info
        areaId: areasTable.id,
        areaName: areasTable.name,
        city: areasTable.city,

        // salesman info
        salesmanId: salesmenTable.id,
        salesmanName: salesmenTable.name,

        // user info
        salesmanImage: usersTable.profileImage,
        salesmanImageId: usersTable.profileImageId,
      })
      .from(visitsTable)
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(areasTable, eq(visitsTable.areaId, areasTable.id))
      .leftJoin(salesmenTable, eq(visitsTable.salesmanId, salesmenTable.userId))
      .leftJoin(usersTable, eq(visitsTable.salesmanId, usersTable.id))
      .where(and(...conditions));

    return res.status(200).json({
      message: "Visits fetched successfully",
      data: visits,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch visits",
      error: error instanceof Error ? error.message : error,
    });
  }
};
 
export const getVisitById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const visit = await db
      .select({
        // visit info
        id: visitsTable.id,
        checkInAt: visitsTable.checkInAt,
        checkOutAt: visitsTable.checkOutAt,
        status: visitsTable.status,
        visitResult: visitsTable.visitResult,
        notes: visitsTable.notes,
        orderBy: visitsTable.orderBy,
        checkInImage: visitsTable.checkInImage,
        checkInImageId: visitsTable.checkInImageId,

        approvalStatus: visitsTable.approvalStatus,
        approvedBy: visitsTable.approvedBy,
        approvedAt: visitsTable.approvedAt,
        adminNote: visitsTable.adminNote,
        rejectionReason: visitsTable.rejectionReason,

        // customer info
        customerId: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        address: customersTable.address,
        latitude: customersTable.latitude,
        longitude: customersTable.longitude,

        // area info
        areaId: areasTable.id,
        areaName: areasTable.name,
        city: areasTable.city,
      })
      .from(visitsTable)
      .leftJoin(customersTable, eq(visitsTable.customerId, customersTable.id))
      .leftJoin(areasTable, eq(visitsTable.areaId, areasTable.id))
      .where(
        and(
          eq(visitsTable.id, id),
          eq(visitsTable.companyId, user.companyId)
        )
      )
      .limit(1);

    if (!visit.length) {
      return res.status(404).json({
        message: "Visit not found",
      });
    }

    const data = visit[0]!;

    // compute duration (in seconds)
    let duration = null;

    if (data.checkInAt && data.checkOutAt) {
      const checkIn = new Date(data.checkInAt).getTime();
      const checkOut = new Date(data.checkOutAt).getTime();
      duration = Math.floor((checkOut - checkIn) / 1000);
    }

    const transactions = await db
      .select({
        transactionId: transactionsTable.id,
        transactionType: transactionsTable.transactionType,
        totalAmount: transactionsTable.totalAmount,
        totalDiscount: transactionsTable.totalDiscount,  
        finalAmount: transactionsTable.finalAmount, 

        paymentStatus: transactionsTable.paymentStatus,
        paymentType: transactionsTable.paymentType,
        paidAmount: transactionsTable.paidAmount,
      })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.visitId, id),
          eq(transactionsTable.companyId, user.companyId)
        )
      );

    const transactionItems = await db
      .select({
        transactionId: transactionItemsTable.transactionId,
        productId: productsTable.id,
        productName: productsTable.name,
        quantity: transactionItemsTable.quantity,
        price: transactionItemsTable.price,
        discount: transactionItemsTable.discount,
        totalAfterDiscount: transactionItemsTable.totalAfterDiscount,
      })
      .from(transactionItemsTable)
      .leftJoin(productsTable, eq(transactionItemsTable.productId, productsTable.id))
      .leftJoin(transactionsTable, eq(transactionItemsTable.transactionId, transactionsTable.id))
      .where(
        and(
          eq(transactionsTable.visitId, id),
          eq(transactionsTable.companyId, user.companyId)
        )
      );

      const formattedTransactions = transactions.map((t) => ({
        ...t,
        items: transactionItems.filter(
          (item) => item.transactionId === t.transactionId
        ),
      }));

    return res.status(200).json({
      message: "Visit fetched successfully",
      data: {
        ...data,
        duration,
        transactions: formattedTransactions, 
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch visit",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteVisit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (!user?.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // check if visit has transactions
    const [transaction] = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.visitId, id));

    if (transaction) {
      return res.status(400).json({
        message: "Cannot delete visit that already has transactions",
      });
    }

    // delete visit (scoped by company)
    const deleted = await db
      .delete(visitsTable)
      .where(
        and(
          eq(visitsTable.id, id),
          eq(visitsTable.companyId, user.companyId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({
        message: "Visit not found",
      });
    }

    return res.status(200).json({
      message: "Visit deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete visit",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const reviewVisit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const { status, adminNote, rejectionReason } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    if (user.role !== "admin" && user.role !== "owner") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const data = await db.transaction(async (tx) => {
      // 1. update visit approval
      const [visit] = await tx
        .update(visitsTable)
        .set({
          approvalStatus: status,
          approvedBy: user.userId,
          approvedAt: new Date(),
          adminNote,
          rejectionReason: status === "rejected" ? rejectionReason : null,
        })
        .where(eq(visitsTable.id, id))
        .returning();

      if (!visit) throw new Error("Visit not found");

      return visit;
    });

    return res.json({
      message: `Visit ${status}`,
      data,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to review visit",
      error: error instanceof Error ? error.message : error,
    });
  }
};