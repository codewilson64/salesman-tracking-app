import { db } from "../database";
import { initOfflineCatalogDb } from "./initOfflineCatalogDb";
import { Customer } from "../../types/customer";

export const saveCustomersToSQLite = async (customers: Customer[]) => {
  await initOfflineCatalogDb();

  const now = new Date().toISOString();

  for (const customer of customers) {
    await db.runAsync(
      `
      INSERT OR REPLACE INTO offline_customers (
        id,
        area_id,
        shop_name,
        address,
        latitude,
        longitude,
        payload_json,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `,
      customer.id,
      customer.areaId,
      customer.shopName,
      customer.address ?? null,
      customer.latitude ?? null,
      customer.longitude ?? null,
      JSON.stringify(customer),
      now
    );
  }
};

export const getCustomersByAreaFromSQLite = async (areaId: string) => {
  await initOfflineCatalogDb();

  const rows = await db.getAllAsync<any>(
    `
    SELECT payload_json
    FROM offline_customers
    WHERE area_id = ?
    ORDER BY shop_name ASC;
    `,
    areaId
  );

  return rows.map((row) => JSON.parse(row.payload_json));
};