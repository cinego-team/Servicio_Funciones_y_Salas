import { Butaca } from "src/entities/butaca.entity";
import { EstadoDisponibilidadButaca } from "src/entities/estadoDisponibilidadButaca.entity";
import { FindOperator } from "typeorm";

export class PeliculaDTO {
    id: number;
    titulo: string;
    duracion: number;
}

export class UsuarioDTO {
    id: number;
    nombre: string;
    legajo: number;
}

export class FuncionInput {
    estaDisponible: boolean;
    fecha: Date;
    hora: string;
    salaId: number;
    formatoId: number;
    disponibilidadButacaId: {
        butacaId: number
        estadoDisponibilidadButaca: string ;
    };
    peliculaId: number;
    usuarioId: number;
}

export class FuncionResponse {
    id: number;
    estaDisponible: boolean;
    fecha: Date;
    hora: string;
    sala: {
        nroSala: number;
        capacidad: number;
        estaDisponible: boolean;
    }
    formato: {
        nombre: string;
        precio: number;
    }
    disponibilidadButaca: {
        nroButaca: number
        estadoDisponibilidadButaca: string ;
    }[];
    pelicula?: PeliculaDTO; 
    usuario?: UsuarioDTO; 
}

export class FuncionInputUpdate {
    estaDisponible: boolean;
    fecha: Date;
    hora: string;
    sala: {
        salaId: number;
    }
    formato: {
        formatoId: number;
    }
    peliculaId: number;
    usuarioId: number;
}

export class FuncionButacasDetalleResponse {
    id: number;
    fecha: Date;
    hora: string;
    estaDisponible: boolean;
    formato: {
        nombre: string;
        precio: number;
    };
    butacas: {
        id: number;
        nroButaca: number;
        fila: {
            id: number;
            nombre: string;
        };
        estadoDisponibilidad: string;
        disponibilidadButacaId: number;
    }[];
}