import { db } from "../database";

let initialized = false;

export const initOfflineCatalogDb = async () => {
  if (initialized) return;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS offline_areas (
      id TEXT PRIMARY KEY NOT NULL,
      area_name TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS offline_customers (
      id TEXT PRIMARY KEY NOT NULL,
      area_id TEXT NOT NULL,
      shop_name TEXT NOT NULL,
      address TEXT,
      latitude REAL,
      longitude REAL,
      payload_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  initialized = true;
};