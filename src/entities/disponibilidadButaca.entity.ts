import { Entity, ManyToOne,PrimaryGeneratedColumn } from 'typeorm';
import { Funcion } from './funcion.entity';
import { Butaca } from './butaca.entity';
import { EstadoDisponibilidadButaca } from './estadoDisponibilidadButaca.entity';

@Entity('DisponibilidadButaca')
export class DisponibilidadButaca {
    @PrimaryGeneratedColumn()
    id: number;

    // Relaciones

    @ManyToOne(() => Funcion, (funcion) => funcion.disponibilidadButaca, { eager: true })
    funcion: Funcion;

    @ManyToOne(() => Butaca, (butaca) => butaca.disponibilidadButaca, { eager: true })
    butaca: Butaca;
    
    @ManyToOne(() => EstadoDisponibilidadButaca, (estadoDisponibilidadButaca) => estadoDisponibilidadButaca.disponibilidadButaca, { eager: true })
    estadoDisponibilidadButaca: EstadoDisponibilidadButaca;
}