import { pgTable, uuid, timestamp, numeric, pgEnum, boolean } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies.js";
import { visitsTable } from "./visit.js";

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
    .references(() => visitsTable.id, { onDelete: "cascade" })
    .notNull(),
  
  transactionType: transactionTypeEnum("transaction_type").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  totalDiscount: numeric("total_discount", { precision: 12, scale: 2 }).default("0").notNull(),
  finalAmount: numeric("final_amount", { precision: 12, scale: 2 }).notNull(),

  paymentStatus: paymentStatusEnum("payment_status").notNull(),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }),
  paymentType: paymentTypeEnum("payment_type"),

  paidAt: timestamp("paid_at"),
  remainingAmount: numeric("remaining_amount", { precision: 12, scale: 2 }).default("0").notNull(),

  adminPaidNotificationRead: boolean("admin_paid_notification_read").default(true).notNull(),
  salesmanPaidNotificationRead: boolean("salesman_paid_notification_read").default(true).notNull(),

  adminUnpaidNotificationRead: boolean("admin_unpaid_notification_read").default(true).notNull(),
  salesmanUnpaidNotificationRead: boolean("salesman_unpaid_notification_read").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});