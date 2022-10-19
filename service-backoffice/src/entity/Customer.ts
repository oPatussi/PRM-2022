import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Brand } from "./Brand";
import { Category } from "./Category";

@Entity()
export class Customer extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false,length:50})
    name: string;
    
    @Column({nullable: true,length:255})
    address: string;
    
    @Column({nullable: true, length:8})
    zipcode: string;
    
    @Column({nullable: true,length:2})
    state: string;

    @Column({nullable: true,length:50})
    city: string;

}