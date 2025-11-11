import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Butaca } from './butaca.entity';
import { Sala } from './sala.entity';

@Entity('fila')
export class Fila {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 3 })
    letraFila: string;

    @OneToMany(() => Butaca, (butaca) => butaca.fila, { eager: true })
    butaca: Butaca[];

    @ManyToOne(() => Sala, (sala) => sala.filas, { eager: true })
    sala: Sala;
}