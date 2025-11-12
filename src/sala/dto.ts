export class SalaInput {
    estaDisponible: boolean;
    nroSala: number;
}

export class SalaResponse {
    id: number;
    estaDisponible: boolean;
    nroSala: number;
    filas?: {
        id: number;
        letraFila: string;
        butacas: {
            id: number;
            nroButaca: number;
            estadoDisponibilidadButaca: string;
        }[];
    }[];
}