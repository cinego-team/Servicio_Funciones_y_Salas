import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Butaca } from './butaca.entity';
import { Sala } from './sala.entity';

@Entity('fila')
export class Fila {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'letra_fila', type: 'char', length: 1 })
    letraFila: string;

    @OneToMany(() => Butaca, (butaca) => butaca.fila)
    butaca: Butaca[];

    @ManyToOne(() => Sala, (sala) => sala.filas)
    sala: Sala;
}