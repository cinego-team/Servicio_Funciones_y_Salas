import { Butaca } from "src/entities/butaca.entity";
import { EstadoDisponibilidadButaca } from "src/entities/estadoDisponibilidadButaca.entity";
import { FindOperator } from "typeorm";

export class FuncionInput {
    estaDisponible: boolean;
    fecha: string;
    hora: string;
    salaId: number;
    formatoId: number;
    disponibilidadButacaId: {
        butacaId: number
        estadoDisponibilidadButaca: string ;
    };
    //peliculaId: number;
    //usuarioId: number;
}
export class FuncionResponse {
    id: number;
    estaDisponible: boolean;
    fecha: string;
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
    //pelicula: {
    // director: string;
    // duracion: number;
    // genero: string;
    // titulo: string;
    // fechaEstreno: string;
    // sinopsis: string;
    // clasificacion: string;
    // idioma: string;;
    // };
    //usuario: {
    // nombre: string;
    // apellido: string;
    // legajo: number; 
    // Rol: {
    //  nomnbre:string
    //  tipoDeCliente:string
    //  permisos: string[]
    //}
}
export class FuncionInputUpdate {
    estaDisponible: boolean;
    fecha: string;
    hora: string;
    sala: {
        salaId: number;
    }
    formato: {
        formatoId: number;
    }
    //pelicula: {
    // director: string;
    // duracion: number;
    // genero: string;
    // titulo: string;
    // fechaEstreno: string;
    // sinopsis: string;
    // clasificacion: string;
    // idioma: string;;
    // };
    //usuario: {
    // nombre: string;
    // apellido: string;
    // email: string;
    // contraseña: string;
    // legajo: number;
    // nroDocumento: number;
    // numeroTelefono: number;
    // tipoDocumento: string;
    // Rol: {
    //  nomnbre:string
    //  tipoDeCliente:string
    //  permisos: string[]
    //}
}