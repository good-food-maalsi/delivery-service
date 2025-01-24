import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {Pool} from "pg";
import * as schema from "@utils/database/schema"

export const pgPool: Pool = new Pool({
    connectionString: process.env.DATABASE_URL!
});

export const db = drizzle(pgPool, {
    schema: { ...schema }
});