import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from './funcion.entity';

@Entity('Formato')
export class Formato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  // Relaciones
  @OneToMany(() => Funcion, (funcion) => funcion.formato)
  funciones: Funcion[];
}