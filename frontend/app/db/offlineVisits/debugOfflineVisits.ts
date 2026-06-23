import { db } from "../database";
import { initOfflineVisitDb } from "./initOfflineVisitDb";

export const debugOfflineVisits = async () => {
  await initOfflineVisitDb();

  const rows = await db.getAllAsync(`
    SELECT *
    FROM offline_visits
    ORDER BY created_at DESC;
  `);

  console.log("OFFLINE VISITS:", JSON.stringify(rows, null, 2));

  return rows;
};