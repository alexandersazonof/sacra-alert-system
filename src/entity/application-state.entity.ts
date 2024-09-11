import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ApplicationStateEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  applicationName!: string;

  @Column()
  metric!: string;

  @Column()
  url!: string;

  @Column()
  result!: string;

  @CreateDateColumn()
  createdAt!: Date;
}