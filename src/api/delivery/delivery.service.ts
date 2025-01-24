import { DeliveryEntity } from "@entities/delivery.entity";
import { DeliveryDTO } from "@dto/delivery.dto";
import { AppDataSource } from "@utils/database/data-source";
import { Repository } from "typeorm";

export class DeliveryServices extends Repository<DeliveryEntity> {
    constructor() {
        super(DeliveryEntity, AppDataSource.manager);
    }

    async getAll(): Promise<DeliveryEntity[]> {
        return await this.find();
    }

    async createOne(delivery: DeliveryDTO): Promise<DeliveryEntity> {
        return await this.save(delivery);
    }
}
