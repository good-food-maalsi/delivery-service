import { describe, expect, it, mock } from "bun:test";
import { DeliveryServices } from "../src/api/delivery/delivery.service";
import { DeliveryEntity, StatusEnum } from "../src/types/entities/delivery.entity";
import { DeliveryDTO } from "../src/types/dto/delivery.dto";

// Mock the AppDataSource and Repository
const mockSave = mock(() => Promise.resolve({}));
const mockFind = mock(() => Promise.resolve([]));
const mockFindOneBy = mock(() => Promise.resolve(null));
const mockUpdate = mock(() => Promise.resolve({}));
const mockDelete = mock(() => Promise.resolve({}));

mock.module("../src/utils/database/data-source", () => ({
    AppDataSource: {
        manager: {},
    },
}));

// Mock the DeliveryController dependencies indirectly by mocking typeorm interactions if needed,
// but since DeliveryServices extends Repository, we might need to handle 'super' call or prototype.
// However, mocking the class methods directly is easier if we are testing the class logic, 
// but we want to test the class logic which relies on 'this.find', 'this.save', etc.
//
// In TypeORM with Active Record or Repository pattern, mocking 'this.find' etc is common.

describe("DeliveryServices Unit Tests", () => {
    let service: DeliveryServices;

    // We need to intercept the TypeORM Repository methods on the prototype or instance
    // Since DeliveryServices extends Repository, we can try to mock the methods on the instance.
    
    // Workaround for testing TypeORM services extending Repository with Bun:
    // We can instantiate the service and then overwrite the methods.
    
    /* 
       Note: A cleaner way often involves using a mock repository injection, but let's try to 
       patch the instance for simplicity as we don't have dependency injection framework.
    */

    service = new DeliveryServices();
    service.find = mockFind as any;
    service.findOneBy = mockFindOneBy as any;
    service.save = mockSave as any;
    service.update = mockUpdate as any;
    service.delete = mockDelete as any;

    it("should get all deliveries", async () => {
        const mockDeliveries = [new DeliveryEntity(), new DeliveryEntity()];
        mockFind.mockResolvedValue(mockDeliveries as any);

        const result = await service.getAll();
        expect(result).toBe(mockDeliveries);
        expect(mockFind).toHaveBeenCalled();
    });

    it("should get one delivery by id", async () => {
        const mockDelivery = new DeliveryEntity();
        mockDelivery.id = "123";
        mockFindOneBy.mockResolvedValue(mockDelivery as any);

        const result = await service.getOne("123");
        expect(result).toBe(mockDelivery);
        expect(mockFindOneBy).toHaveBeenCalledWith({ id: "123" });
    });

    it("should create a delivery", async () => {
        const dto: DeliveryDTO = {
            shop_name: "Test Shop",
            comment: "Test",
            status: StatusEnum.PENDING,
            shop_location: "POINT(0 0)",
            user_location: "POINT(0 0)",
            deliverer_id: "d1",
            user_id: "u1"
        };
        const savedEntity = { ...dto, id: "1", created_at: new Date(), updated_at: new Date() } as DeliveryEntity;
        mockSave.mockResolvedValue(savedEntity as any);

        const result = await service.createOne(dto);
        expect(result).toBe(savedEntity);
        expect(mockSave).toHaveBeenCalledWith(dto);
    });

    it("should update a delivery", async () => {
        const updateDto = { status: StatusEnum.DELIVERED };
        const updatedEntity = { id: "1", status: StatusEnum.DELIVERED } as DeliveryEntity;
        
        mockUpdate.mockResolvedValue({ affected: 1 } as any);
        mockFindOneBy.mockResolvedValue(updatedEntity as any);

        const result = await service.updateOne("1", updateDto);
        expect(result).toBe(updatedEntity);
        expect(mockUpdate).toHaveBeenCalledWith("1", updateDto);
    });

    it("should delete a delivery", async () => {
        mockDelete.mockResolvedValue({ affected: 1 } as any);
        await service.deleteOne("1");
        expect(mockDelete).toHaveBeenCalledWith("1");
    });
});
