import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./Customer";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, {eager: true, nullable: false})
    customer: Customer;

    @Column({nullable: false})
    orderDate: Date;

    @Column({nullable: true})
    invoicedDate: Date;

    @Column({nullable: true})
    canceledDate: Date;

    @Column({nullable: false})
    deadline: Date;

    @Column('decimal', {nullable: true, precision: 10, scale: 2})
    shipping: number;

    @Column({nullable: true, length: 20})
    status: string;

    @OneToMany(type => OrderItem, item => item.order, {eager: true, cascade: true})
    items: OrderItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}