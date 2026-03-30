import { type Request, type Response } from "express";
import { productsTable } from "../db/schemas/products";
import { db } from "../index.js";
import { and, eq } from "drizzle-orm";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, productImage, productImageId } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    // auth check
    if (!user?.companyId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const companyId = user.companyId;

    // validation
    if (!name) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    // insert
    const [product] = await db
      .insert(productsTable)
      .values({
        name,
        description,
        price,
        companyId,
        productImage,
        productImageId,
      })
      .returning();

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
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

    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        productImage: productsTable.productImage,
      })
      .from(productsTable)
      .where(eq(productsTable.companyId, user.companyId));

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch products",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        productImage: productsTable.productImage,
        productImageId: productsTable.productImageId,
      })
      .from(productsTable)
      .where(
        and(
          eq(productsTable.id, id),
          eq(productsTable.companyId, user.companyId) 
        )
      );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: products[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, price, productImage, productImageId } = req.body;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const updatedProduct = await db
      .update(productsTable)
      .set({
        name,
        description,
        price,
        productImage,
        productImageId,
      })
      .where(
        and(
          eq(productsTable.id, id),
          eq(productsTable.companyId, user.companyId)
        )
      )
      .returning();

    if (updatedProduct.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = req.user as {
      userId: string;
      companyId: string;
      role: string;
    };

    const deleted = await db
      .delete(productsTable)
      .where(
        and(
          eq(productsTable.id, id),
          eq(productsTable.companyId, user.companyId) 
        )
      )
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete product",
      error: error instanceof Error ? error.message : error,
    });
  }
};