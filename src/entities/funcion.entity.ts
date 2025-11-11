import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
//import { Pelicula } from './pelicula.entity';
import { Sala } from './sala.entity';
import { Formato } from './formato.entity';
import { DisponibilidadButaca } from './disponibilidadButaca.entity';
//import { Venta } from './venta.entity';

@Entity('Funcion')
export class Funcion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    estaDisponible: boolean;

    @Column({ type: 'date' })
    fecha: Date;

    @Column()
    hora: string;

  @Column({ type: 'int' })
  peliculaId: number;

  @Column({ type: 'int'})
  usuarioId: number;

  //Relaciones
  //@ManyToOne(() => Pelicula, (pelicula) => pelicula.Funcion, { eager: true })
  //pelicula: Pelicula;
  //pelicuaId: number;

    //@ManyToOne(() => Usuario, (usuario) => usuario.funciones, { eager: true })
    //usuario: Usuario;

    @ManyToOne(() => Sala, (sala: Sala) => sala.funciones, { eager: true })
    sala: Sala;
    salaId: number;

    @ManyToOne(() => Formato, (formato: Formato) => formato.funciones, { eager: true })
    formato: Formato;
    formatoId: number;

    @OneToMany(() => DisponibilidadButaca, (disponibilidadButaca) => disponibilidadButaca.funcion)
    disponibilidadButaca: DisponibilidadButaca[];
}