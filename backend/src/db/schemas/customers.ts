import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

import { companiesTable } from "./companies.js";
import { areasTable } from "./areas.js";

export const customersTable = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  areaId: uuid("area_id")
    .references(() => areasTable.id)
    .notNull(),

  customerName: varchar("customer_name", { length: 255 }).notNull(),
  shopName: varchar("shop_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: varchar("address", { length: 255 }),
  description: varchar("description", { length: 500 }),

  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),

  customerImage: varchar("customer_image", { length: 500 }),
  customerImageId: varchar("customer_image_id", { length: 255 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
