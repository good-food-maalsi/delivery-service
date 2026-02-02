import { createElysia } from "@utils/elysia.create";

import { DeliveryServices } from "./delivery.service";
import { DeliveryEntity } from "@entities/delivery.entity";
import { DeliveryDTO, DeliveryObject } from "@dto/delivery.dto";
import { t } from "elysia";

const _deliveryServices: DeliveryServices = new DeliveryServices();

export const DeliveryController = createElysia({ prefix: "/delivery" })
    // .guard({
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
    // })
    .get("/", async (): Promise<DeliveryEntity[]> => {
        console.log("@GET /delivery");
        return await _deliveryServices.getAll();
    })

            .get(
                "/:id",
                async ({ params: { id }, set }): Promise<DeliveryEntity | unknown> => {
                    console.log("@GET /delivery/:id");
                    const delivery = await _deliveryServices.getOne(id);
                    if (!delivery) {
                        set.status = 404;
                        return { message: "Delivery not found" };
                    }
                    return delivery;
                },
                {
                    params: t.Object({
                        id: t.String(),
                    }),
                },
            )

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
            )

            .patch(
                "/:id",
                async ({ params: { id }, body, set }): Promise<DeliveryEntity | unknown> => {
                    console.log("@PATCH /delivery/:id");
                    const delivery = await _deliveryServices.updateOne(id, body);
                    if (!delivery) {
                        set.status = 404;
                        return { message: "Delivery not found" };
                    }
                    return delivery;
                },
                {
                    params: t.Object({
                        id: t.String(),
                    }),
                    body: t.Partial(DeliveryObject),
                },
            )

            .delete(
                "/:id",
                async ({ params: { id } }): Promise<{ message: string }> => {
                    console.log("@DELETE /delivery/:id");
                    await _deliveryServices.deleteOne(id);
                    return { message: "Deleted" };
                },
                {
                    params: t.Object({
                        id: t.String(),
                    }),
                },
            );
