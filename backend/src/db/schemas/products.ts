import { pgTable, uuid, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";

export const productsTable = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  price: integer("price"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});