import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Funcion } from './funcion.entity';
import { Butaca } from './butaca.entity';
import { EstadoDisponibilidadButaca } from './estadoDisponibilidadButaca.entity';

@Entity('disponibilidad_butaca')
export class DisponibilidadButaca {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Funcion, (funcion) => funcion.disponibilidadButaca)
    @JoinColumn({ name: 'funcion_id' })
    funcion: Funcion;

    @ManyToOne(() => Butaca, (butaca) => butaca.disponibilidadButaca)
    @JoinColumn({ name: 'butaca_id' })
    butaca: Butaca;

    @ManyToOne(() => EstadoDisponibilidadButaca, (estadoDisponibilidadButaca) => estadoDisponibilidadButaca.disponibilidadButaca)
    @JoinColumn({ name: 'estado_disponibilidad_butaca_id' })
    estadoDisponibilidadButaca: EstadoDisponibilidadButaca;
}