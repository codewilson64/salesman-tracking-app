import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies.js";
import { roleEnum } from "./enums.js";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("salesman").notNull(),

  name: varchar("name", { length: 255 }),
  address: varchar("address", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  profileImage: varchar("profile_image", { length: 500 }),
  profileImageId: varchar("profile_image_id", { length: 255 }),

  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});