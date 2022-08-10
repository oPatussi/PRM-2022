import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Brand extends BaseEntity {
    @PrimaryGeneratedColumn()
    ide: number;

    @Column({nullable: false, length: 50})
    name: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    uptadeAt: Date;
}