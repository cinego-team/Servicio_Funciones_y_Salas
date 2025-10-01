import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from './funcion.entity';
import { Fila } from './fila.entity';

@Entity('Sala')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ default: true })
  estaDisponible: boolean;

  @Column({ unique: true })
  nroSala: number;

  // Relaciones
  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones: Funcion[];
  
  @OneToMany(() => Fila, (fila) => fila.sala)
  filas: Fila[];
}