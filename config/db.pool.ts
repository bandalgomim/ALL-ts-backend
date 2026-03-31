import { createPool, Pool } from "mysql2/promise";
import getDbConfig from "./db.config";

let pool: Pool;

export function initPool() {
  if (!pool) {
    pool = createPool(getDbConfig());
  }
}

export function getPool() {
  return pool;
}
