import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DisponibilidadButaca } from './disponibilidadButaca.entity';

// Enum con los valores posibles
export enum EstadoButacaEnum {
    DISPONIBLE = 'DISPONIBLE',
    OCUPADA = 'OCUPADA', //cuando ya fue comprada
    RESERVADA = 'RESERVADA', //cuando estan siendo compradas
    FUERA_DE_SERVICIO = 'FUERA_DE_SERVICIO',
}

@Entity('estado_disponibilidad_butaca')
export class EstadoDisponibilidadButaca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: EstadoButacaEnum,
    })
    nombre: EstadoButacaEnum;

    // Relación con DisponibilidadButaca
    @OneToMany(
        () => DisponibilidadButaca,
        (disponibilidadButaca) => disponibilidadButaca.estadoDisponibilidadButaca
    )
    disponibilidadButaca: DisponibilidadButaca[];
}