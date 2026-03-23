import { pgTable, uuid, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";
import { salesmenTable } from "./salesmen";

export const areasTable = pgTable("areas", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  salesmanId: uuid("salesman_id")
    .references(() => salesmenTable.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  day: varchar("day", { length: 20 }).notNull(),
  weeks: jsonb("weeks").$type<number[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

