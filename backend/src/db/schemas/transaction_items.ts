import { pgTable, uuid, numeric, integer } from "drizzle-orm/pg-core";
import { productsTable } from "./products"; // assuming you have this
import { transactionsTable } from "./transactions";

export const transactionItemsTable = pgTable("transaction_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id")
    .references(() => transactionsTable.id)
    .notNull(),
  productId: uuid("product_id")
    .references(() => productsTable.id)
    .notNull(),

  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
});