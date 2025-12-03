import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DisponibilidadButaca } from './disponibilidadButaca.entity';

export enum EstadoButacaEnum {
    DISPONIBLE = 'DISPONIBLE',
    OCUPADA = 'OCUPADA',
    RESERVADA = 'RESERVADA',
    FUERA_DE_SERVICIO = 'FUERA_DE_SERVICIO',
}

@Entity('estado_disponibilidad_butaca')
export class EstadoDisponibilidadButaca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: EstadoButacaEnum,
        name: 'estado_butaca',
    })
    nombre: EstadoButacaEnum;

    @OneToMany(
        () => DisponibilidadButaca,
        (disponibilidadButaca) => disponibilidadButaca.estadoDisponibilidadButaca
    )
    disponibilidadButaca: DisponibilidadButaca[];
}