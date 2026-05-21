import { pgTable, uuid, timestamp, text, pgEnum, varchar, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";
import { areasTable } from "./areas";
import { customersTable } from "./customers";
import { usersTable } from "./users";

export const visitResultEnum = pgEnum("visit_result_enum", [
  "new order",
  "follow-up",
  "shop closed",
]);

export const visitStatusEnum = pgEnum("visit_status", [
  "check-in",
  "check-out",
]);

export const visitApprovalStatusEnum = pgEnum("visit_approval_status", [
  "pending",
  "approved",
  "rejected",
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

  status: visitStatusEnum("status").default("check-in").notNull(),
  visitResult: visitResultEnum("visit_result"),
  checkInAt: timestamp("check_in_at").defaultNow().notNull(),
  checkOutAt: timestamp("check_out_at"),
  notes: text("notes"),
  orderBy: varchar("order_by", { length: 255 }),
  
  checkInImage: varchar("check_in_image", { length: 500 }),
  checkInImageId: varchar("check_in_image_id", { length: 255 }),

  // Check in distance
  checkInLatitude: doublePrecision("check_in_latitude"),
  checkInLongitude: doublePrecision("check_in_longitude"),

  checkOutLatitude: doublePrecision("check_out_latitude"),
  checkOutLongitude: doublePrecision("check_out_longitude"),

  checkInDistanceMeters: doublePrecision("check_in_distance_meters"),
  checkOutDistanceMeters: doublePrecision("check_out_distance_meters"),

  checkInGpsAccuracy: doublePrecision("check_in_gps_accuracy"),
  checkOutGpsAccuracy: doublePrecision("check_out_gps_accuracy"),

  // Notification
  isAdminNotificationRead: boolean("is_admin_notification_read").default(true).notNull(),
  isSalesmanNotificationRead: boolean("is_salesman_notification_read").default(true).notNull(),
  

  // Admin Approval
  approvalStatus: visitApprovalStatusEnum("approval_status").default("pending").notNull(),
  approvedBy: uuid("approved_by")
  .references(() => usersTable.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  adminNote: text("admin_note"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});