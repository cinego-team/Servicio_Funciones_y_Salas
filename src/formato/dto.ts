import { Funcion } from "../entities/funcion.entity";

export class FormatoInput {
    nombre: string;
    precio: number;
}
export class FormatoResponse {
    id: number;
    nombre: string;
    precio: number;
    funciones?: Funcion[];
}