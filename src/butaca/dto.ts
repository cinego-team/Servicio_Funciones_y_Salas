import { DisponibilidadButaca } from "../entities/disponibilidadButaca.entity";
import { Fila } from "../entities/fila.entity";

export class ButacaInput {
    nroButaca: number;
    filaId: number;
    disponibilidadId?: number;
}

export class ButacaResponse {
    id: number;
    nroButaca: number;
    fila: Fila;
    disponibilidadButaca: DisponibilidadButaca;
}