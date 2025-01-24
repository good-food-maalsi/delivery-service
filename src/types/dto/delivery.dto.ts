import {t} from "elysia";
import {StatusEnum} from "@entities/delivery.entity";

export type DeliveryDTO = typeof DeliveryObject.static;

export const DeliveryObject = t.Object({
    shop_name: t.String(),
    comment: t.String(),
    status: t.Enum(StatusEnum),
    shop_location: t.Any(),
    user_location: t.Any(),
    deliverer_id: t.String(),
    user_id: t.String()
});