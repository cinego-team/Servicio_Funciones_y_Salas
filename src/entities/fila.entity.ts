import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Butaca } from './butaca.entity';
import { Sala } from './sala.entity';

@Entity('Fila')
export class Fila {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 3 })
    letraFila: string;

    // Relaciones

    @OneToMany(() => Butaca, (butaca) => butaca.fila, { eager: true })
    butaca: Butaca[];
    @ManyToOne(() => Sala, (sala) => sala.filas, { eager: true })
    sala: Sala;
}