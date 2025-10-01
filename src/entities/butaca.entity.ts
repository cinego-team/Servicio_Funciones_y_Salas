import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DisponibilidadButaca } from './disponibilidadButaca.entity';
import { Fila } from './fila.entity';

@Entity('Butaca')
export class Butaca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 3 })
    nroButaca: number;

    // Relaciones

    @OneToMany(() => DisponibilidadButaca, (disponibilidadButaca) => disponibilidadButaca.butaca, { eager: true })
    disponibilidadButaca: DisponibilidadButaca;
    
    @ManyToOne(() => Fila, (fila) => fila.butaca, { eager: true })
    fila: Fila;
}