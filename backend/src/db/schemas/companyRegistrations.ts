import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const registrationPlanEnum = pgEnum("registration_plan_enum",
  ["1-month", "6-month", "12-month"]
);

export const companyRegistrationsTable = pgTable("company_registrations", {
    id: uuid("id").defaultRandom().primaryKey(),

    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),

    companyName: varchar("company_name", { length: 255 }).notNull(),
    businessField: varchar("business_field", { length: 255 }).notNull(),

    address: varchar("address", { length: 255 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),

    plan: registrationPlanEnum("plan").notNull(),
    status: varchar("status", { length: 20 }).default("pending"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});