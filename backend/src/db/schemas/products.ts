import { pgTable, uuid, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies.js";

export const productUnitEnum = pgEnum("product_unit", [
  "pcs",
  "unit",
  "dus",
  "box",
  "karton",
  "pack",
  "sak",
  "karung",
  "kg",
  "gram",
  "liter",
  "meter",
  "m2",
  "set",
]);

export const productsTable = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  price: integer("price"),
  unit: productUnitEnum("unit").default("pcs").notNull(),
  productImage: varchar("product_image", { length: 500 }),
  productImageId: varchar("product_image_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});