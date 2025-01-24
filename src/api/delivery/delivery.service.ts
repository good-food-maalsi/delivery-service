import { Delivery } from "@models/database/delivery";
import { db } from "@utils/database";
import { deliveriesSchema } from "@utils/database/schema";
import { DeliveryDTO } from "@models/dto/delivery.dto";

export class DeliveryServices {
    _database;

    constructor() {
        this._database = db;
    }

    async getAll(): Promise<Delivery[]> {
        return this._database.select().from(deliveriesSchema);
    }

    async create(delivery: DeliveryDTO): Promise<Delivery> {
        const result = await this._database
            .insert(deliveriesSchema)
            .values(delivery)
            .returning();
        return result[0];
    }
}
