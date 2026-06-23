import { db } from "../database";
import { initOfflineVisitDb } from "./initOfflineVisitDb";

export const getActiveOfflineVisit = async () => {
  await initOfflineVisitDb();

  const rows = await db.getAllAsync<any>(`
    SELECT *
    FROM offline_visits
    WHERE status = 'check-in'
    AND sync_status != 'synced'
    ORDER BY created_at DESC
    LIMIT 1;
  `);

  return rows[0] ?? null;
};