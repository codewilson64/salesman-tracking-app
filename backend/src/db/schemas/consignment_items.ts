import { pgTable, uuid, numeric, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { productsTable } from "./products.js";
import { visitsTable } from "./visit.js";

export const consignmentItemsTable = pgTable("consignment_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  visitId: uuid("visit_id")
    .references(() => visitsTable.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id")
    .references(() => productsTable.id)
    .notNull(),
    
  type: varchar("type", { length: 20 }).notNull(), 

  quantity: integer("quantity").notNull().default(0),

  currentStock: integer("current_stock").notNull().default(0),
  remainingStock: integer("remaining_stock").notNull().default(0),
  addedStock: integer("added_stock").notNull().default(0),
  returnedStock: integer("returned_stock").notNull().default(0),
  soldQuantity: integer("sold_quantity").notNull().default(0),
  newStock: integer("new_stock").notNull().default(0),

  price: numeric("price", { precision: 12, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});