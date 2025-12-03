import { EstadoButacaEnum } from "../entities/estadoDisponibilidadButaca.entity";

export class DisponibilidadButacaInput {
    funcionId: number
    butacaId: number;
    estadoDisponibilidadButacaId: EstadoButacaEnum;
}

export class DisponibilidadButacaResponse {
    id: number;
    funcionId: number;
    butacaId: number;
    estadoDisponibilidadButacaId: EstadoButacaEnum;
}

export class CambiarEstadoButacasInput {
    disponibilidadButacaIds: number[];
}

export class CambiarEstadoButacasResponse {
    actualizadas: number;
    mensaje: string;
}