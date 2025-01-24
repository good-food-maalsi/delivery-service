import { createElysia } from "@utils/elysia.create";

import { DeliveryServices } from "./delivery.service";
import { DeliveryEntity } from "@entities/delivery.entity";
import { DeliveryDTO, DeliveryObject } from "@dto/delivery.dto";

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
            .get("/", async (): Promise<DeliveryEntity[]> => {
                console.log("@GET /delivery");
                return await _deliveryServices.getAll();
            })

            .post(
                "/",
                async ({ body }): Promise<DeliveryEntity> => {
                    console.log("@POST /delivery");
                    const deliveryDto: DeliveryDTO = body;

                    return await _deliveryServices.createOne(deliveryDto);
                },
                {
                    body: DeliveryObject,
                },
            ),
);
