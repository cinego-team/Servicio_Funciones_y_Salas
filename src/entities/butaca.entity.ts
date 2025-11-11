import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DisponibilidadButaca } from './disponibilidadButaca.entity';
import { Fila } from './fila.entity';

@Entity('butaca')
export class Butaca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nroButaca: number;

    @OneToMany(() => DisponibilidadButaca, (disponibilidadButaca) => disponibilidadButaca.butaca)
    disponibilidadButaca: DisponibilidadButaca;

    @ManyToOne(() => Fila, (fila) => fila.butaca)
    fila: Fila;
}