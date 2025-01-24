import { deliveriesSchema } from "@utils/database/schema";

export type Delivery = typeof deliveriesSchema.$inferSelect;
