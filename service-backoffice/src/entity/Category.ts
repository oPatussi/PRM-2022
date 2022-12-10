import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({nullable: false, length: 50})
    name: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
}