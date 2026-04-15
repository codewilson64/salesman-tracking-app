import { pgTable, uuid, timestamp, numeric, pgEnum, varchar } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";
import { visitsTable } from "./visit";

export const transactionTypeEnum = pgEnum("transaction_type_enum", [
  "cash",
  "credit",
]);

export const paymentStatusEnum = pgEnum("payment_status_enum", [
  "paid",
  "partial",
  "unpaid",
]);

export const paymentTypeEnum = pgEnum("payment_type_enum", [
  "cash",
  "transfer",
]);

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  visitId: uuid("visit_id")
    .references(() => visitsTable.id)
    .notNull(),
  
  transactionType: transactionTypeEnum("transaction_type").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }),
  totalDiscount: numeric("total_discount", { precision: 12, scale: 2 }).default("0").notNull(),
  finalAmount: numeric("final_amount", { precision: 12, scale: 2 }),

  paymentStatus: paymentStatusEnum("payment_status"),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }),
  paymentType: paymentTypeEnum("payment_type"),

  remainingAmount: numeric("remaining_amount", { precision: 12, scale: 2 }).default("0").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});