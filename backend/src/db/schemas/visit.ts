import { pgTable, uuid, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";
import { areasTable } from "./areas";
import { customersTable } from "./customers";
import { usersTable } from "./users";

export const visitResultEnum = pgEnum("visit_result_enum", [
  "new order",
  "follow-up",
  "shop closed",
]);

export const visitsTable = pgTable("visits", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  salesmanId: uuid("salesman_id")
    .references(() => usersTable.id) 
    .notNull(),
  areaId: uuid("area_id")
    .references(() => areasTable.id)
    .notNull(),
  customerId: uuid("customer_id")
    .references(() => customersTable.id)
    .notNull(),
  checkInAt: timestamp("check_in_at").defaultNow().notNull(),
  checkOutAt: timestamp("check_out_at"),
  visitResult: visitResultEnum("visit_result"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});