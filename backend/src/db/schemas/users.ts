import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";
import { roleEnum } from "./enums";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role")
    .notNull()
    .default("salesman"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});