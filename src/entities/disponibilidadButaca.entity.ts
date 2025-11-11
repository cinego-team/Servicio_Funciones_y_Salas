import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Funcion } from './funcion.entity';
import { Butaca } from './butaca.entity';
import { EstadoDisponibilidadButaca } from './estadoDisponibilidadButaca.entity';

@Entity('disponibilidad_butaca')
export class DisponibilidadButaca {
    @PrimaryGeneratedColumn()
    id: number;

    // Relaciones

    @ManyToOne(() => Funcion, (funcion) => funcion.disponibilidadButaca)
    funcion: Funcion;

    @ManyToOne(() => Butaca, (butaca) => butaca.disponibilidadButaca)
    butaca: Butaca;

    @ManyToOne(() => EstadoDisponibilidadButaca, (estadoDisponibilidadButaca) => estadoDisponibilidadButaca.disponibilidadButaca)
    estadoDisponibilidadButaca: EstadoDisponibilidadButaca;
}