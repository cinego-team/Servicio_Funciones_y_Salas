import { EstadoButacaEnum } from "../entities/estadoDisponibilidadButaca.entity";

export class EstadoDisponibilidadInput {
    nombre: EstadoButacaEnum;
}

export class EstadoDisponibilidadResponse {
    id: number;
    nombre: EstadoButacaEnum;
}