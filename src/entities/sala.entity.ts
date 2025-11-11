import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from './funcion.entity';
import { Fila } from './fila.entity';

@Entity('sala')
export class Sala {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    estaDisponible: boolean;

    @Column()
    nroSala: number;

    // Relaciones
    @OneToMany(() => Funcion, (funcion) => funcion.sala)
    funciones: Funcion[];

    @OneToMany(() => Fila, (fila) => fila.sala)
    filas: Fila[];
}