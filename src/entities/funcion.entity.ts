import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Sala } from './sala.entity';
import { Formato } from './formato.entity';
import { DisponibilidadButaca } from './disponibilidadButaca.entity';

@Entity('funcion')
export class Funcion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'esta_disponible' })
    estaDisponible: boolean;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ name: 'pelicula_id' })
    peliculaId: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @ManyToOne(() => Sala, (sala: Sala) => sala.funciones)
    sala: Sala;

    @ManyToOne(() => Formato, (formato: Formato) => formato.funciones)
    formato: Formato;

    @OneToMany(() => DisponibilidadButaca, (disponibilidadButaca) => disponibilidadButaca.funcion)
    disponibilidadButaca: DisponibilidadButaca[];
}