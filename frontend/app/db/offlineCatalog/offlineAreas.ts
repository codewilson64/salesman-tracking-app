import { db } from "../database";
import { initOfflineCatalogDb } from "./initOfflineCatalogDb";
import { Area } from "../../types/area";

export const saveAreasToSQLite = async (areas: Area[]) => {
  await initOfflineCatalogDb();

  const now = new Date().toISOString();

  for (const area of areas) {
    await db.runAsync(
      `
      INSERT OR REPLACE INTO offline_areas (
        id,
        area_name,
        payload_json,
        updated_at
      )
      VALUES (?, ?, ?, ?);
      `,
      area.id,
      area.areaName,
      JSON.stringify(area),
      now
    );
  }
};

export const getAreasFromSQLite = async () => {
  await initOfflineCatalogDb();

  const rows = await db.getAllAsync<any>(`
    SELECT payload_json
    FROM offline_areas
    ORDER BY area_name ASC;
  `);

  return rows.map((row) => JSON.parse(row.payload_json));
};