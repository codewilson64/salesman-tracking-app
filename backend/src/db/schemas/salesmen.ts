import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";
import { usersTable } from "./users";

export const salesmenTable = pgTable("salesmen", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companiesTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  profileImage: varchar("profile_image", { length: 500 }),
  profileImageId: varchar("profile_image_id", { length: 255 }),
});