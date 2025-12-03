import { Butaca } from "../entities/butaca.entity";
import { Sala } from "../entities/sala.entity";

export class FilaInput {
    letraFila: string;
    salaId: number;
    butacasId: number[];
}

export class FilaResponse {
    id: number;
    letraFila: string;
    sala: Sala;
    butacas: Butaca[];
}