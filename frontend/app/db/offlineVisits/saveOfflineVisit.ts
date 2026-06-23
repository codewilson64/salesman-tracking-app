import { db } from "../database";
import { initOfflineVisitDb } from "./initOfflineVisitDb";
import { createLocalId } from "./createLocalId";
import { OfflineVisitInput } from "./offlineVisit.types";

export const saveOfflineVisit = async ({
  data,
  image,
  customer,
  checkInDistanceMeters,
}: OfflineVisitInput) => {
  await initOfflineVisitDb();

  const now = new Date().toISOString();
  const localId = createLocalId();

  const payloadJson = JSON.stringify({
    ...data,
    checkInImageUri: image ?? null,
    checkInDistanceMeters,
    localId,
  });

  const values = [
    localId,

    data.areaId,
    data.customerId,
    customer.shopName ?? null,

    image ?? null,

    data.checkInLatitude,
    data.checkInLongitude,
    data.checkInGpsAccuracy ?? null,
    checkInDistanceMeters,
    now,

    customer.latitude ?? null,
    customer.longitude ?? null,
    customer.address ?? null,

    "check-in",
    "pending",

    payloadJson,

    now,
    now,
  ];

  try {
    await db.runAsync(
      `
      INSERT INTO offline_visits (
        local_id,

        area_id,
        customer_id,
        customer_name,

        check_in_image_uri,

        check_in_latitude,
        check_in_longitude,
        check_in_gps_accuracy,
        check_in_distance_meters,
        check_in_at,

        customer_latitude,
        customer_longitude,
        customer_address,

        status,
        sync_status,

        payload_json,

        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      ...values
    );

    return {
      localId,
      syncStatus: "pending" as const,
    };
  } catch (error) {
    console.log("saveOfflineVisit SQLite error:", error);
    console.log("saveOfflineVisit values:", values);
    throw error;
  }
};