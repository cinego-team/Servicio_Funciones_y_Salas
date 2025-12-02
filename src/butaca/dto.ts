export class ButacaInput {
    nroButaca: number;
    filaId: number;
    disponibilidadId: number;
}

export class ButacaResponse {
    id: number;
    nroButaca: number;
    fila: {
        letraFila: string;
    };
    estadoDisponibilidad: {
        nombre: string;
    };
}