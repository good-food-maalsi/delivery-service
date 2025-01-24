import { createElysia } from "@utils/elysia.create";
import { DeliveryController } from "./delivery/delivery.controller";

export const apiRoutes = createElysia();

apiRoutes.use(DeliveryController);
