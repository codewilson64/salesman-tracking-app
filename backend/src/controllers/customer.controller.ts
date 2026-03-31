import type { Request, Response } from "express";
import { areasTable } from "../db/schemas/areas";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { customersTable } from "../db/schemas/customers";
import { salesmenTable } from "../db/schemas";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { areaId, customerName, shopName, phone, address, description, customerImage, customerImageId } = req.body;

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

    const companyId = user.companyId;

    // basic validation
    if (!areaId || !customerName || !shopName || !phone) {
      return res.status(400).json({
        message: "Missing required fields",
      });
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
      return res.status(400).json({ message: "Invalid area" });
    }

    // insert customer
    const [customer] = await db
      .insert(customersTable)
      .values({
        areaId,
        companyId,
        customerName,
        shopName,
        phone,
        address,
        description,
        customerImage,
        customerImageId
      })
      .returning();

    return res.status(201).json({
      message: "Customer created successfully",
      data: customer,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create customer",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
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

    let condition;

    /* ================= CONDITION ================= */

    if (user.role === "salesman") {
      // 🔥 map userId → salesmanId
      const [salesman] = await db
        .select()
        .from(salesmenTable)
        .where(eq(salesmenTable.userId, user.userId));

      if (!salesman) {
        return res.status(400).json({ message: "Salesman not found" });
      }

      condition = and(
        eq(customersTable.companyId, user.companyId),
        eq(areasTable.salesmanId, salesman.id) // ✅ filter via area
      );
    } else {
      condition = eq(customersTable.companyId, user.companyId);
    }

    /* ================= QUERY ================= */

    const customers = await db
      .select({
        id: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        phone: customersTable.phone,
        address: customersTable.address,
        description: customersTable.description,
        createdAt: customersTable.createdAt,

        // area info
        areaId: areasTable.id,
        areaName: areasTable.name,
        city: areasTable.city,

        // salesman info
        salesmanId: salesmenTable.id,
        salesmanName: salesmenTable.name,
        salesmanImage: salesmenTable.profileImage,
        salesmanImageId: salesmenTable.profileImageId,
      })
      .from(customersTable)
      .leftJoin(areasTable, eq(customersTable.areaId, areasTable.id))
      .leftJoin(salesmenTable, eq(areasTable.salesmanId, salesmenTable.id))
      .where(condition);

    return res.status(200).json({
      message: "Customers fetched successfully",
      data: customers,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch customers",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
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

    if (!id) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    const [customer] = await db
      .select({
        id: customersTable.id,
        customerName: customersTable.customerName,
        shopName: customersTable.shopName,
        phone: customersTable.phone,
        address: customersTable.address,
        description: customersTable.description,
        customerImage: customersTable.customerImage,
        customerImageId: customersTable.customerImageId,

        // area info
        areaId: areasTable.id,
        areaName: areasTable.name,
        city: areasTable.city,
        day: areasTable.day,
        weeks: areasTable.weeks,

        // salesman info
        salesmanId: salesmenTable.id,
        salesmanName: salesmenTable.name,
        salesmanPhone: salesmenTable.phone,
      })
      .from(customersTable)
      .leftJoin(areasTable, eq(customersTable.areaId, areasTable.id))
      .leftJoin(salesmenTable, eq(areasTable.salesmanId, salesmenTable.id))
      .where(
        and(
          eq(customersTable.id, id),
          eq(customersTable.companyId, user.companyId)
        )
      );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      message: "Customer fetched successfully",
      data: customer,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch customer",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const { areaId, customerName, shopName, phone, address, description, customerImage, customerImageId} = req.body;

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

    // ✅ optional: validate area if provided
    if (areaId) {
      const [area] = await db
        .select()
        .from(areasTable)
        .where(
          and(
            eq(areasTable.id, areaId),
            eq(areasTable.companyId, user.companyId)
          )
        );

      if (!area) {
        return res.status(400).json({
          message: "Invalid area",
        });
      }
    }

    const updatedCustomer = await db
      .update(customersTable)
      .set({
        areaId,
        customerName,
        shopName,
        phone,
        address,
        description,
        customerImage,
        customerImageId,
      })
      .where(
        and(
          eq(customersTable.id, id),
          eq(customersTable.companyId, user.companyId)
        )
      )
      .returning();

    if (updatedCustomer.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      message: "Customer updated successfully",
      data: updatedCustomer[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update customer",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    await db.transaction(async (tx) => {
      const [customer] = await tx
        .select()
        .from(customersTable)
        .where(
          and(
            eq(customersTable.id, id),
            eq(customersTable.companyId, user.companyId)
          )
        );

      if (!customer) {
        throw new Error("NOT_FOUND");
      }

      // delete customer
      await tx
        .delete(customersTable)
        .where(eq(customersTable.id, id));
    });

    return res.status(200).json({
      message: "Customer deleted successfully",
    });

  } catch (error: any) {
    console.error(error);

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(500).json({
      message: "Failed to delete customer",
      error: error instanceof Error ? error.message : error,
    });
  }
};

