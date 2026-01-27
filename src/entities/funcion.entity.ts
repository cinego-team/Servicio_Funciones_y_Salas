import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Sala } from './sala.entity';
import { Formato } from './formato.entity';
import { Idioma } from './idioma.entity';
import { DisponibilidadButaca } from './disponibilidadButaca.entity';

@Entity('funcion')
export class Funcion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'esta_disponible' })
    estaDisponible: boolean;

    @Column({ type: 'date' })
    fecha: Date;
    @Column({ type: 'time',default: '00:00' })
    hora: string;

    @Column({ name: 'pelicula_id' })
    peliculaId: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @ManyToOne(() => Sala, (sala: Sala) => sala.funciones)
    sala: Sala;

    @ManyToOne(() => Formato, (formato: Formato) => formato.funciones)
    formato: Formato;
    @ManyToOne(() => Idioma, (idioma) => idioma.funciones)
    idioma: Idioma;

    @OneToMany(
        () => DisponibilidadButaca,
        (disponibilidadButaca) => disponibilidadButaca.funcion,
    )
    disponibilidadButaca: DisponibilidadButaca[];
}
