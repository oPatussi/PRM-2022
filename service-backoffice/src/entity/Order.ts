import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Brand } from "./Brand";
import { Category } from "./Category";
import { Customer } from "./Customer";

@Entity()
export class Order extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, {eager: true,nullable: false})
    customer: Customer;

    @CreateDateColumn({nullable: true})
    orderDate: Date;

    @CreateDateColumn({nullable: true})
    invoiceDate: Date;
    
    @UpdateDateColumn({nullable: true})
    canceledDate: Date;

}