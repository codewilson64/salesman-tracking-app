import { db } from "../database";
import { initOfflineVisitDb, resetOfflineVisitDbInitializedState } from "./initOfflineVisitDb";

export const resetOfflineVisitDb = async () => {
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS offline_visits;
    `);

    resetOfflineVisitDbInitializedState();

    await initOfflineVisitDb();

    console.log("Offline visits table reset successfully");
  } catch (error) {
    console.log("Failed to reset offline visits table:", error);
    throw error;
  }
};