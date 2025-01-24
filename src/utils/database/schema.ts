import {pgTable, uuid, varchar, point, date, pgEnum} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";

export const statusEnum = pgEnum("status", ["pending", "inProgress", "delivered"]);

export const deliveriesSchema = pgTable("deliveries", {
    id: uuid('uuid2').default(sql`gen_random_uuid()`).primaryKey(),
    shop_name: varchar({ length: 255 }).notNull(),
    comment: varchar({ length: 255 }),
    status: statusEnum().default("pending"),
    shop_location: point().notNull(),
    user_location: point().notNull(),
    deliverer_id: uuid(),
    user_id: uuid().notNull(),
    created_at: date().defaultNow(),
    updated_at: date().defaultNow().$onUpdate(() => new Date().toDateString())
});