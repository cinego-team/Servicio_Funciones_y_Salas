import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from './funcion.entity';
import { Fila } from './fila.entity';

@Entity('sala')
export class Sala {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'esta_disponible' })
    estaDisponible: boolean;

    @Column({ name: 'nro_sala' })
    nroSala: number;

    @OneToMany(() => Funcion, (funcion) => funcion.sala)
    funciones: Funcion[];

    @OneToMany(() => Fila, (fila) => fila.sala)
    filas: Fila[];
}
