export const CREATE_OFFLINE_VISITS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS offline_visits (
    local_id TEXT PRIMARY KEY NOT NULL,

    area_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT,

    check_in_image_uri TEXT,

    check_in_latitude REAL NOT NULL,
    check_in_longitude REAL NOT NULL,
    check_in_gps_accuracy REAL,
    check_in_distance_meters INTEGER NOT NULL,
    check_in_at TEXT NOT NULL,

    customer_latitude REAL,
    customer_longitude REAL,
    customer_address TEXT,

    status TEXT NOT NULL DEFAULT 'check-in',
    sync_status TEXT NOT NULL DEFAULT 'pending',

    payload_json TEXT NOT NULL,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;