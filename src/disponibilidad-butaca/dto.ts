import { EstadoButacaEnum } from "src/entities/estadoDisponibilidadButaca.entity";

export class DisponibilidadButacaResponse {
    id: number;
    funcionId: number;
    butacaId: number;
    estadoDisponibilidadButacaId: EstadoButacaEnum;
}