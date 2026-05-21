import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const subscriptionStatusEnum = pgEnum("subscription_status_enum", [
  "active", 
  "inactive"
]);

export const companiesTable = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default("active").notNull(),
  subscriptionEndDate: timestamp("subscription_end_date"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});