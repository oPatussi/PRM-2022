import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Brand } from "./Brand";
import { Category } from "./Category";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderItem extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, {eager: true,nullable: false})
    order: Order;

    @ManyToOne(() => Product, {eager: true,nullable: false})
    product: Product;

    @Column({nullable: false})
    amount: number;
    
    @Column({nullable: false})
    value: number;

}