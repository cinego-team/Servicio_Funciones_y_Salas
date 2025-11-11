import { EstadoButacaEnum } from "src/entities/estadoDisponibilidadButaca.entity";

export class DisponibilidadButacaResponse {
    id: number;
    funcionId: number;
    butacaId: number;
    estadoDisponibilidadButacaId: EstadoButacaEnum;
}

// DTO para cambiar estado de múltiples butacas
export class CambiarEstadoButacasInput {
    disponibilidadButacaIds: number[];
}

export class CambiarEstadoButacasResponse {
    actualizadas: number;
    mensaje: string;
}