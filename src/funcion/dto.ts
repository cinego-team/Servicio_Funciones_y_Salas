import { DisponibilidadButaca } from '../entities/disponibilidadButaca.entity';
import { Formato } from "../entities/formato.entity";
import { Sala } from "../entities/sala.entity";

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
    peliculaId: number
    sala: Sala;
    formato: Formato;
    usuarioId: number;
    disponibilidadButaca: DisponibilidadButaca[];
}

export class FuncionButacasDetalleResponse {
    id: number;
    disponibilidadButaca: DisponibilidadButaca[];
}