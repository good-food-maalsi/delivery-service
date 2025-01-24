import {t} from "elysia";
import {statusEnum} from "@utils/database/schema";

export type DeliveryDTO = typeof DeliveryObject.static;

export const DeliveryObject = t.Object({
    shop_name: t.String(),
    comment: t.String(),
    status: t.UnionEnum(statusEnum.enumValues),
    shop_location: t.Any(),
    user_location: t.Any(),
    deliverer_id: t.String(),
    user_id: t.String()
});