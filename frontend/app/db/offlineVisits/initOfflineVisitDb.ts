import { db } from "../database";
import { CREATE_OFFLINE_VISITS_TABLE_SQL } from "./offlineVisit.schema";

let isInitialized = false;

export const initOfflineVisitDb = async () => {
  if (isInitialized) return;

  await db.execAsync(CREATE_OFFLINE_VISITS_TABLE_SQL);

  isInitialized = true;
};

export const resetOfflineVisitDbInitializedState = () => {
  isInitialized = false;
};