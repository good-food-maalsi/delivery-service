import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export enum StatusEnum {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    DELIVERED = "delivered",
}

@Entity({
    name: "deliveries",
})
export class DeliveryEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    shop_name: string;

    @Column({ nullable: true })
    comment: string;

    @Column({
        type: "enum",
        enum: StatusEnum,
        default: StatusEnum.PENDING,
    })
    status: string;

    @Column({ type: "point" })
    shop_location: string;

    @Column({ type: "point" })
    user_location: string;

    @Column({ type: "uuid", nullable: true })
    deliverer_id: string;

    @Column({ type: "uuid", nullable: true })
    user_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
