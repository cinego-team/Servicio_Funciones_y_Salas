import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from './funcion.entity';

@Entity('formato')
export class Formato {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    // Relaciones
    @OneToMany(() => Funcion, (funcion) => funcion.formato)
    funciones: Funcion[];
}