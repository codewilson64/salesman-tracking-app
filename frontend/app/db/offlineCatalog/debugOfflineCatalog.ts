import { db } from "../database";
import { initOfflineCatalogDb } from "./initOfflineCatalogDb";

export const debugOfflineCatalog = async () => {
  await initOfflineCatalogDb();

  const areas = await db.getAllAsync(`
    SELECT *
    FROM offline_areas
    ORDER BY area_name ASC;
  `);

  const customers = await db.getAllAsync(`
    SELECT *
    FROM offline_customers
    ORDER BY shop_name ASC;
  `);

  console.log("OFFLINE AREAS:", JSON.stringify(areas, null, 2));
  console.log("OFFLINE CUSTOMERS:", JSON.stringify(customers, null, 2));

  return {
    areas,
    customers,
  };
};