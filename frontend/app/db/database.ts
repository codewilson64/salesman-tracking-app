import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("sales_tracker.db");