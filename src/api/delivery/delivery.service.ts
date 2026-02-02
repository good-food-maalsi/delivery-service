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

    async getOne(id: string): Promise<DeliveryEntity | null> {
        return await this.findOneBy({ id });
    }

    async createOne(delivery: DeliveryDTO): Promise<DeliveryEntity> {
        return await this.save(delivery);
    }

    async updateOne(id: string, delivery: Partial<DeliveryDTO>): Promise<DeliveryEntity | null> {
        await this.update(id, delivery);
        return await this.getOne(id);
    }

    async deleteOne(id: string): Promise<void> {
        await this.delete(id);
    }
}
