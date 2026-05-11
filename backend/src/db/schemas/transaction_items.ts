import { pgTable, uuid, numeric, integer } from "drizzle-orm/pg-core";
import { productsTable } from "./products"; 
import { transactionsTable } from "./transactions";

export const transactionItemsTable = pgTable("transaction_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id")
    .references(() => transactionsTable.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id")
    .references(() => productsTable.id)
    .notNull(),

  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 }).default("0") .notNull(),
  totalAfterDiscount: numeric("total_after_discount", { precision: 12, scale: 2 }).notNull(),
});