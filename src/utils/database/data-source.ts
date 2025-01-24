import "reflect-metadata"
import {DataSource} from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "mypassword",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: ["src/types/entities/*.ts"],
    migrations: ['src/utils/database/migrations/*.ts'],
    subscribers: []
});