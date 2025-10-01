import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DisponibilidadButaca } from './disponibilidadButaca.entity';

// Enum con los valores posibles
export enum EstadoButacaEnum {
  DISPONIBLE = 'DISPONIBLE',
  NO_DISPONIBLE = 'NO_DISPONIBLE',
  FUERA_DE_SERVICIO = 'FUERA_DE_SERVICIO',
}

@Entity('EstadoDisponibilidadButaca')
export class EstadoDisponibilidadButaca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EstadoButacaEnum.DISPONIBLE,
    unique: true,
  })
  nombre: EstadoButacaEnum;

  // Relación con DisponibilidadButaca
  @OneToMany(
    () => DisponibilidadButaca,
    (disponibilidadButaca) => disponibilidadButaca.estadoDisponibilidadButaca
  )
  disponibilidadButaca: DisponibilidadButaca[];
}