import { createElysia } from "@utils/createElysia";

import { DeliveryServices } from "./delivery.service";
import { Delivery } from "@models/database/delivery";
import { DeliveryDTO, DeliveryObject } from "@models/dto/delivery.dto";

const _deliveryServices: DeliveryServices = new DeliveryServices();

export const DeliveryController = createElysia({ prefix: "/delivery" }).guard(
    // {
    //      async beforeHandle({ set, jwtAccess, cookie }) {
    //          const isAuth = await isAuthenticated(jwtAccess, cookie);
    //
    //         if (!isAuth.success) {
    //             set.status = 401;
    //             return {
    //                 success: false,
    //                 message: isAuth.message,
    //                 errors: isAuth.errors,
    //             };
    //         }
    //     },
    // },
    (app) =>
        app
            .get("/", async (): Promise<Delivery[]> => {
                console.log("@GET /delivery");
                return await _deliveryServices.getAll();
            })

            .post(
                "/",
                async ({ body }): Promise<Delivery> => {
                    console.log("@POST /delivery");
                    const deliveryDto: DeliveryDTO = body;

                    return await _deliveryServices.create(deliveryDto);
                },
                {
                    body: DeliveryObject,
                },
            ),
);
