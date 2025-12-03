import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from './funcion.entity';

@Entity('formato')
export class Formato {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    @OneToMany(() => Funcion, (funcion) => funcion.formato)
    funciones: Funcion[];
}