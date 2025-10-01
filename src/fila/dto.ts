export class FilaInput {
  letraFila: string;
  salaId: number;
}

export class FilaResponse {
  id: number;
  letraFila: string;
  sala: {
    nroSala: number;
    capacidad: number;
  };
  butacas?: {
    id: number;
    nroButaca: number;
    estadoDisponibilidadButaca: string;
  }[];
}