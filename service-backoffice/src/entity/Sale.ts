import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {Order} from "./Order";

@Entity()
export class Sale extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, {eager: true, nullable: false})
    order: Order;

    @Column({nullable: false})
    saleDate: Date;

    @Column('decimal', {nullable: false, precision: 10, scale: 2})
    total: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}