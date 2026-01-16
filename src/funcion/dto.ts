import { DisponibilidadButaca } from '../entities/disponibilidadButaca.entity';
import { Formato } from '../entities/formato.entity';
import { Sala } from '../entities/sala.entity';

export class FuncionInput {
    estaDisponible: boolean;
    fecha: string;
    peliculaId: number;
    salaId: number;
    formatoId: number;
    usuarioId: number;
}

export class FuncionResponse {
    id: number;
    estaDisponible: boolean;
    fecha: Date;
    peliculaId: number;
    sala: Sala;
    formato: Formato;
    usuarioId: number;
}

export class ButacasDetalleResponse {
    disponibilidadButaca: DisponibilidadButaca[];
}
export class FuncionInputAdmin {
    peliculaId: number;
    fecha: Date;
    estaDisponible: boolean;
    idioma: {
        id: number;
        nombre: string;
    };
    sala: {
        id: number;
        nroSala: number;
    };
    formato: {
        id: number;
        nombre: string;
        precio: number;
    };
}
export class FuncionResponseAdmin {
    id: number;
    peliculaId: number;
    fecha: Date;
    estaDisponible: boolean;
    idioma: {
        id: number;
        nombre: string;
    } | null;
    sala: {
        id: number;
        nroSala: number;
    } | null;
    formato: {
        id: number;
        nombre: string;
        precio: number;
    } | null;
}
