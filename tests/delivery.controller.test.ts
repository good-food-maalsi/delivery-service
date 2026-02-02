import { describe, expect, it, mock, beforeAll } from "bun:test";
// import { DeliveryController } from "../src/api/delivery/delivery.controller";
import { DeliveryServices } from "../src/api/delivery/delivery.service";

// Mock the DeliveryServices
const mockGetAll = mock(() => Promise.resolve([]));
const mockGetOne = mock(() => Promise.resolve(null));
const mockCreateOne = mock(() => Promise.resolve({}));
const mockUpdateOne = mock(() => Promise.resolve(null));
const mockDeleteOne = mock(() => Promise.resolve());

mock.module("../src/api/delivery/delivery.service", () => {
    return {
        DeliveryServices: class {
            getAll = mockGetAll;
            getOne = mockGetOne;
            createOne = mockCreateOne;
            updateOne = mockUpdateOne;
            deleteOne = mockDeleteOne;
        },
    };
});

describe("DeliveryController Functional Tests", () => {
    let app: any;

    // Import the controller AFTER mocking the module
    beforeAll(async () => {
        const { DeliveryController } = await import("../src/api/delivery/delivery.controller");
        app = DeliveryController;
    });

    it("GET /delivery should return all deliveries", async () => {
        mockGetAll.mockResolvedValue([{ id: "1", shop_name: "Shop 1" }] as any);
        
        const response = await app.handle(new Request("http://localhost/delivery/"));
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toHaveLength(1);
        expect(mockGetAll).toHaveBeenCalled();
    });

    it("GET /delivery/:id should return a delivery if found", async () => {
        const mockData = { id: "123", shop_name: "Shop 1" };
        mockGetOne.mockResolvedValue(mockData as any);

        const response = await app.handle(new Request("http://localhost/delivery/123"));
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toEqual(mockData);
        expect(mockGetOne).toHaveBeenCalledWith("123");
    });

    it("GET /delivery/:id should return 404 if not found", async () => {
        mockGetOne.mockResolvedValue(null);

        const response = await app.handle(new Request("http://localhost/delivery/999"));
        expect(response.status).toBe(404);
    });

    it("POST /delivery should create a delivery", async () => {
        const payload = {
            shop_name: "New Shop",
            comment: "Fast",
            status: "pending",
            shop_location: "POINT(1 1)",
            user_location: "POINT(2 2)",
            deliverer_id: "d1",
            user_id: "u1"
        };
        const created = { ...payload, id: "created-id" };
        mockCreateOne.mockResolvedValue(created);

        const response = await app.handle(new Request("http://localhost/delivery/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }));

        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toEqual(created);
        expect(mockCreateOne).toHaveBeenCalled(); // Checking call arguments might require deep object matching
    });

    it("PATCH /delivery/:id should update a delivery", async () => {
        const updatePayload = { status: "delivered" };
        const updated = { id: "1", status: "delivered" };
        mockUpdateOne.mockResolvedValue(updated as any);

        const response = await app.handle(new Request("http://localhost/delivery/1", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload)
        }));

        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toEqual(updated);
        expect(mockUpdateOne).toHaveBeenCalledWith("1", updatePayload);
    });

    it("DELETE /delivery/:id should delete a delivery", async () => {
        mockDeleteOne.mockResolvedValue(undefined);

        const response = await app.handle(new Request("http://localhost/delivery/1", {
            method: "DELETE"
        }));

        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toEqual({ message: "Deleted" });
        expect(mockDeleteOne).toHaveBeenCalledWith("1");
    });
});
