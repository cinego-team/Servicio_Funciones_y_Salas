import { Funcion } from 'src/entities/funcion.entity';

export class IdiomaInput {
    nombre: string;
}

export class IdiomaResponse {
    id: number;
    nombre: string;
    funcion?: Funcion[];
}
