import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Funcion } from './funcion.entity';

@Entity('idioma')
export class Idioma {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;

    @OneToMany(() => Funcion, (funcion) => funcion.idioma)
    funciones: Funcion[];
}
