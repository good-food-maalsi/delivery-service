import { AppDataSource } from "@utils/database/data-source";
import { startOrderCreatedConsumer } from "./messaging/order-created.consumer";

async function bootstrap() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected (Consumer)");

        await startOrderCreatedConsumer();
        console.log("Delivery RabbitMQ consumer started successfully");
    } catch (error) {
        console.error("Failed to start delivery RabbitMQ consumer:", error);
        process.exit(1);
    }
}

bootstrap();
