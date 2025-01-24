import { createElysia } from "@utils/createElysia";
import {DeliveryController} from "@api/delivery/delivery.controller";

export const apiRoutes = createElysia();

apiRoutes.use(DeliveryController);