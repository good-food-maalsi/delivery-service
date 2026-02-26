import * as amqp from "amqplib";
import { AppDataSource } from "@utils/database/data-source";
import { DeliveryEntity, StatusEnum } from "@entities/delivery.entity";

const EXCHANGE_NAME = "good-food-events";
const ROUTING_KEY = "order.created";
const QUEUE_NAME = "delivery.order.created";
const RETRY_DELAY_MS = parseInt(process.env.RABBITMQ_RETRY_MS || "5000", 10);

interface OrderCreatedEvent {
    orderId: string;
    shopId: string;
    userId?: string | null;
    total?: number;
    items?: unknown[];
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRabbitUrl(): string {
    if (process.env.RABBITMQ_URL) {
        return process.env.RABBITMQ_URL;
    }

    const user =
        process.env.RABBITMQ_USER || process.env.RABBITMQ_USERNAME || "guest";
    const password = process.env.RABBITMQ_PASSWORD || "guest";
    const host = process.env.RABBITMQ_HOST || "localhost";
    const port = process.env.RABBITMQ_PORT || "5672";

    if (host.includes(":")) {
        return `amqp://${user}:${password}@${host}`;
    }

    return `amqp://${user}:${password}@${host}:${port}`;
}

export async function startOrderCreatedConsumer(): Promise<void> {
    const rabbitUrl = getRabbitUrl();
    const deliveryRepo = AppDataSource.getRepository(DeliveryEntity);

    while (true) {
        try {
            const connection = await amqp.connect(rabbitUrl);
            const channel = await connection.createChannel();

            connection.on("error", (error) => {
                console.error(
                    "Delivery consumer RabbitMQ connection error:",
                    error,
                );
            });

            await channel.assertExchange(EXCHANGE_NAME, "topic", {
                durable: true,
            });
            await channel.assertQueue(QUEUE_NAME, { durable: true });
            await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);
            await channel.prefetch(10);

            await channel.consume(
                QUEUE_NAME,
                async (msg) => {
                    if (!msg) {
                        return;
                    }

                    try {
                        const payload = JSON.parse(
                            msg.content.toString(),
                        ) as OrderCreatedEvent;

                        console.log(
                            "Delivery consumer received order.created event for order:",
                            payload.orderId,
                        );

                        const delivery = deliveryRepo.create({
                            shop_name: payload.shopId,
                            shop_location: "(0,0)",
                            user_location: "(0,0)",
                            user_id: payload.userId || undefined,
                            status: StatusEnum.PENDING,
                        });

                        await deliveryRepo.save(delivery);
                        console.log(
                            "Delivery created for order:",
                            payload.orderId,
                            "delivery id:",
                            delivery.id,
                        );

                        channel.ack(msg);
                    } catch (error) {
                        console.error(
                            "Delivery consumer failed to process order.created:",
                            error,
                        );
                        channel.nack(msg, false, false);
                    }
                },
                { noAck: false },
            );

            console.log(
                `Delivery consumer subscribed to ${ROUTING_KEY} on ${QUEUE_NAME}`,
            );

            await new Promise<void>((resolve) => {
                connection.on("close", () => {
                    console.error(
                        "Delivery consumer RabbitMQ connection closed. Reconnecting...",
                    );
                    resolve();
                });
            });
        } catch (error) {
            console.error("Delivery consumer startup failed:", error);
        }

        await sleep(RETRY_DELAY_MS);
    }
}
