import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funcion } from '../entities/funcion.entity';
import { Repository } from 'typeorm';
import { FuncionButacasDetalleResponse, FuncionInput, FuncionInputUpdate, FuncionResponse } from './dto';
import { Sala } from 'src/entities/sala.entity';
import { Formato } from 'src/entities/formato.entity';
import { DisponibilidadButaca } from 'src/entities/disponibilidadButaca.entity';
import { Butaca } from 'src/entities/butaca.entity';
import { EstadoButacaEnum, EstadoDisponibilidadButaca } from 'src/entities/estadoDisponibilidadButaca.entity';
import { axiosAPIPeliculas } from 'src/axios_service/axios.client';
import { config } from '../axios_service/env';

@Injectable()
export class FuncionService {
    
    constructor(
        @InjectRepository(Funcion)
        private funcionRepo: Repository<Funcion>,
        @InjectRepository(Formato)
        private formatoRepo: Repository<Formato>,
        @InjectRepository(Sala)
        private salaRepo: Repository<Sala>,
        @InjectRepository(DisponibilidadButaca)
        private disponibilidadButacaRepo: Repository<DisponibilidadButaca>,
        @InjectRepository(Butaca)
        private butacaRepo: Repository<Butaca>,
        @InjectRepository(EstadoDisponibilidadButaca)
        private estadoDisponibilidadButacaRepo: Repository<EstadoDisponibilidadButaca>,
        //@InjectRepository(Pelicula)
        //private peliculaRepo: Repository<Pelicula>,
        //@InjectRepository(Usuario)
        //private usuarioRepo: Repository<Usuario>,
        
        
    ) {}
    async newFuncion(datos: FuncionInput): Promise<FuncionResponse> {
        //const constPelicula = await this.peliculaRepo.findOne({
        //    where: { id: datos.peliculaId },
        //});
        //if (!constPelicula) throw new Error("404 Pelicula not found.");

        //const constUsuario = await this.usuarioRepo.findOne({
        //    where: { id: datos.usuarioId },
        //});
        //if (!constUsuario) throw new Error("404 Usuario not found.");

        const constFormato = await this.formatoRepo.findOne({
            where: { id: datos.formatoId },
        });
        if (!constFormato) throw new Error("404 Formato not found.");

        const constSala = await this.salaRepo.findOne({
            where: { id: datos.salaId },
        });
        if (!constSala) throw new Error("404 Sala not found.");

        const constButaca = await this.butacaRepo.findOne({
            where: { id: datos.disponibilidadButacaId.butacaId },
        });
        if (!constButaca) throw new Error("404 Butaca not found.");

        const estado = await this.estadoDisponibilidadButacaRepo.findOne({
            where: { nombre: EstadoButacaEnum.DISPONIBLE }, // nombre es la columna del estado
        });
        if (!estado) throw new Error("404 EstadoDisponibilidadButaca not found.");

        //const constDisponibilidadButaca = await this.disponibilidadButacaRepo.findOne({
        //    where: { id: datos.disponibilidadButacaId },
        //});
        //if (!constDisponibilidadButaca) throw new Error("404 DisponibilidadButaca not found.");

        const constFuncion = this.funcionRepo.create({
            hora: datos.hora,
            fecha: datos.fecha,
            estaDisponible: true,
        });
        await this.funcionRepo.save(constFuncion);

        let i = 0;
        const disponibilidades: DisponibilidadButaca[] = [];
        while (constSala.capacidad > i) {
        const constDisponibilidadButaca = this.disponibilidadButacaRepo.create({
            butaca: constButaca,
            estadoDisponibilidadButaca: estado,
            funcion: constFuncion,
        });
        disponibilidades.push(constDisponibilidadButaca);
        i++;
    }

        //Pelicula data desde microservicio de peliculas
        let peliculaData = null;
        if (constFuncion.peliculaId) {
            try {
                const response = await axiosAPIPeliculas.get(config.APIPeliculasUrls.getPeliculaById(constFuncion.peliculaId));
                peliculaData = response.data;
            } catch (error) {
                console.error(`Error al obtener película ${constFuncion.peliculaId}:`, error.message);
            }
        }

        //Usuario data desde microservicio de usuarios
        let usuarioData = null;
        if (constFuncion.usuarioId) {
            try {
                const response = await axiosAPIPeliculas.get(config.APIUsuariosUrls.getDatosEmpleadoById(constFuncion.usuarioId));
                usuarioData = response.data;
            } catch (error) {
                console.error(`Error al obtener usuario ${constFuncion.usuarioId}:`, error.message);
                // No lanzar error, solo continuar sin datos de usuario
            }
        }

        await this.disponibilidadButacaRepo.save(disponibilidades);

        const response: FuncionResponse = {
            id: constFuncion.id,
            estaDisponible: true,
            fecha: constFuncion.fecha,
            hora: constFuncion.hora,
            sala: {
                nroSala: constFuncion.sala.nroSala,
                capacidad: constFuncion.sala.capacidad,
                estaDisponible: constFuncion.sala.estaDisponible,
            },
            formato: {
                nombre: constFuncion.formato.nombre,
                precio: constFuncion.formato.precio,
            },
            disponibilidadButaca: Array.isArray(constFuncion.disponibilidadButaca) && constFuncion.disponibilidadButaca.length > 0
                ? constFuncion.disponibilidadButaca.map(item => ({
                    nroButaca: item.butaca.nroButaca,
                    estadoDisponibilidadButaca: String(item.estadoDisponibilidadButaca.nombre),
                }))
                : [],
            pelicula: peliculaData ?? undefined,
            usuario: usuarioData ?? undefined,
        };
        return response;

        //24 async permite definir una función asincrónica (que puede esperar a que se resuelva una promesa)
        //24 Promise<Runcion> es el tipo de dato que se espera que devuelva la función
        //24 una promesa representa una operación asincrónica que puede completarse en el futuro
        //25 await permite esperar a que se resuelva una promesa (en este caso, se espera a que se resuelva la búsqueda de la ciudad)
        //26 throw permite lanzar un error manualmente
        //28 crea la instancia de la entidad location
        //29 guarda la instancia de la entidad location en la base de datos
    }
    async getFuncionById(id: number): Promise<FuncionResponse> {
        const constFuncion = await this.funcionRepo.findOne({
            where: { id },
            relations: {
                sala: true,
                formato: true,
                disponibilidadButaca: true,
            },
        });

        if (!constFuncion) throw new Error('404 Funcion not found.');

        //Pelicula data desde microservicio de peliculas
        let peliculaData = null;
        if (constFuncion.peliculaId) {
            try {
                const response = await axiosAPIPeliculas.get(config.APIPeliculasUrls.getPeliculaById(constFuncion.peliculaId));
                peliculaData = response.data;
            } catch (error) {
                console.error(`Error al obtener película ${constFuncion.peliculaId}:`, error.message);
                // No lanzar error, solo continuar sin datos de película
            }
        }

        //Usuario data desde microservicio de usuarios
        let usuarioData = null;
        if (constFuncion.usuarioId) {
            try {
                const response = await axiosAPIPeliculas.get(config.APIUsuariosUrls.getDatosEmpleadoById(constFuncion.usuarioId));
                usuarioData = response.data;
            } catch (error) {
                console.error(`Error al obtener usuario ${constFuncion.usuarioId}:`, error.message);
                // No lanzar error, solo continuar sin datos de usuario
            }
        }

        
        return {
            id: constFuncion.id,
            estaDisponible: constFuncion.estaDisponible,
            fecha: constFuncion.fecha,
            hora: constFuncion.hora,
            sala: {
                nroSala: constFuncion.sala.nroSala,
                capacidad: constFuncion.sala.capacidad,
                estaDisponible: constFuncion.sala.estaDisponible,
            },
            formato: {
                nombre: constFuncion.formato.nombre,
                precio: constFuncion.formato.precio,
            },
            disponibilidadButaca: Array.isArray(constFuncion.disponibilidadButaca) && constFuncion.disponibilidadButaca.length > 0
                ? constFuncion.disponibilidadButaca.map(item => ({
                    nroButaca: item.butaca.nroButaca,
                    estadoDisponibilidadButaca: String(item.estadoDisponibilidadButaca.nombre),
                }))
                : [],
            pelicula: peliculaData ?? undefined, 
            usuario: usuarioData ?? undefined,
        };
    }

    async updateFuncion
    (id: number, datos: FuncionInputUpdate): Promise<FuncionResponse> {
        const constFuncion = await this.funcionRepo.findOne({ where: { id } });
        if (!constFuncion) throw new Error('404 Funcion not found.');
        const constFormato = await this.funcionRepo.findOne({ where: { id: datos.formato.formatoId } });
        if (!constFormato) throw new Error('404 Formato not found.');
        const constSala = await this.funcionRepo.findOne({ where: { id: datos.sala.salaId } });
        if (!constSala) throw new Error('404 Sala not found.');
        //const constPelicula = await this.funcionRepo.findOne({ where: { id: datos.peliculaId } });
        //if (!constFuncion) throw new Error('404 Pelicula not found.');
        //const constUsuario = await this.funcionRepo.findOne({ where: { id: datos.usuarioId } });
        //if (!constFuncion) throw new Error('404 Usuario not found.');

        constFuncion.fecha = datos.fecha;
        constFuncion.hora = datos.hora;
        constFuncion.estaDisponible = datos.estaDisponible;
        constFuncion.salaId = datos.sala.salaId
        constFuncion.formatoId = datos.formato.formatoId
        await this.funcionRepo.save(constFuncion);
        await this.salaRepo.save(constSala);
        await this.formatoRepo.save(constFormato);

        const response: FuncionResponse = {
            id: constFuncion.id,
            estaDisponible: constFuncion.estaDisponible,
            fecha: constFuncion.fecha,
            hora: constFuncion.hora,
            sala: {
                nroSala: constFuncion.sala.nroSala,
                capacidad: constFuncion.sala.capacidad,
                estaDisponible: constFuncion.sala.estaDisponible,
            },
            formato: {
                nombre: constFuncion.formato.nombre,
                precio: constFuncion.formato.precio,
            },
            disponibilidadButaca: Array.isArray(constFuncion.disponibilidadButaca) && constFuncion.disponibilidadButaca.length > 0
                ? constFuncion.disponibilidadButaca.map(item => ({
                    nroButaca: item.butaca.nroButaca,
                    estadoDisponibilidadButaca: String(item.estadoDisponibilidadButaca.nombre),
                }))
                : [],
            //peliculaId: constPelicula.id;
            //usuarioId: constUsuario.id;
        };
        return response;
    }

    async getFuncionesByPeliculaId(peliculaId: number): Promise<FuncionResponse[]> {
    const funciones = await this.funcionRepo.find({
        where: { peliculaId },
        relations: {
            sala: true,
            formato: true,
            disponibilidadButaca: {
                butaca: true,
                estadoDisponibilidadButaca: true,
            },
        },
    });

    if (!funciones || funciones.length === 0) {
        throw new Error('404 No se encontraron funciones para esta película.');
    }

    return funciones.map(funcion => ({
        id: funcion.id,
        estaDisponible: funcion.estaDisponible,
        fecha: funcion.fecha,
        hora: funcion.hora,
        peliculaId: funcion.peliculaId, // Incluir en la respuesta
        sala: {
            nroSala: funcion.sala.nroSala,
            capacidad: funcion.sala.capacidad,
            estaDisponible: funcion.sala.estaDisponible,
        },
        formato: {
            nombre: funcion.formato.nombre,
            precio: funcion.formato.precio,
        },
        disponibilidadButaca: Array.isArray(funcion.disponibilidadButaca) && funcion.disponibilidadButaca.length > 0
            ? funcion.disponibilidadButaca.map(item => ({
                nroButaca: item.butaca.nroButaca,
                estadoDisponibilidadButaca: String(item.estadoDisponibilidadButaca.nombre),
            }))
            : [],
    }));
}


    async partialUpdateFuncion( id: number,datos: Partial<FuncionInputUpdate>,): Promise<FuncionResponse> {
        const constFuncion = await this.funcionRepo.findOne({where: { id },relations: { sala: true, formato: true, disponibilidadButaca: {butaca: true,estadoDisponibilidadButaca: true,}, },}); // pelicula: true, usuario: true
        if (!constFuncion) throw new Error("404 Funcion not found.");

        if (datos.fecha) constFuncion.fecha = datos.fecha;
        if (datos.hora) constFuncion.hora = datos.hora;
        if (datos.estaDisponible) constFuncion.estaDisponible = datos.estaDisponible;

          // === Actualizar sala ===

        if (datos.sala?.salaId) {
            const sala = await this.salaRepo.findOne({
            where: { id: datos.sala.salaId },
            });
            if (!sala) throw new Error("404 Sala not found.");
            constFuncion.sala = sala;
        }

        // === Actualizar formato ===

        if (datos.formato?.formatoId) {
            const formato = await this.formatoRepo.findOne({
            where: { id: datos.formato.formatoId },
            });
            if (!formato) throw new Error("404 Formato not found.");
            constFuncion.formato = formato;
        }

          await this.funcionRepo.save(constFuncion);


         // Recargar con todas las relaciones
        const updatedFuncion = await this.funcionRepo.findOne({
            where: { id },
            relations: {
            sala: true,
            formato: true,
            disponibilidadButaca: {
                butaca: true,
                estadoDisponibilidadButaca: true,
            },
            },
        });
        if (!updatedFuncion) throw new Error("404 Funcion not found after update.");


        const response: FuncionResponse = {
        id: updatedFuncion.id,
        estaDisponible: updatedFuncion.estaDisponible,
        fecha: updatedFuncion.fecha,
        hora: updatedFuncion.hora,
        sala: {
        nroSala: updatedFuncion.sala.nroSala,
        capacidad: updatedFuncion.sala.capacidad,
        estaDisponible: updatedFuncion.sala.estaDisponible,
        },
        formato: {
        nombre: updatedFuncion.formato.nombre,
        precio: updatedFuncion.formato.precio,
        },
        disponibilidadButaca: updatedFuncion.disponibilidadButaca.map((db) => ({
        nroButaca: db.butaca.nroButaca,
        estadoDisponibilidadButaca: db.estadoDisponibilidadButaca.nombre,
        })),
    };
    return response;
    }
    

    //Funcion Importante para el front
    //Detalle de la funcion con las butacas y su estado
    //para poder renderizar en el front
    async getFuncionWithButacasDetails(id: number): Promise<FuncionButacasDetalleResponse> {
    const funcion = await this.funcionRepo.findOne({
        where: { id },
        relations: {
            formato: true,
            disponibilidadButaca: {
                butaca: {
                    fila: true,
                },
                estadoDisponibilidadButaca: true,
            },
        },
    });

    if (!funcion) {
        throw new Error('404 Función no encontrada.');
    }

    return {
        id: funcion.id,
        fecha: funcion.fecha,
        hora: funcion.hora,
        estaDisponible: funcion.estaDisponible,
        formato: {
            nombre: funcion.formato.nombre,
            precio: funcion.formato.precio,
        },
        butacas: Array.isArray(funcion.disponibilidadButaca) && funcion.disponibilidadButaca.length > 0
            ? funcion.disponibilidadButaca.map(dispButaca => ({
                id: dispButaca.butaca.id,
                nroButaca: dispButaca.butaca.nroButaca,
                fila: {
                    id: dispButaca.butaca.fila.id,
                    nombre: dispButaca.butaca.fila.letraFila,
                },
                estadoDisponibilidad: String(dispButaca.estadoDisponibilidadButaca.nombre),
                disponibilidadButacaId: dispButaca.id,
            }))
            : [],
    };
}

    async deleteFuncionById(id: number): Promise<{ message: string }> {
        const constFuncion = await this.funcionRepo.findOne({ where: { id } });
        if (!constFuncion) throw new Error('404 Funcion not found.');
        await this.funcionRepo.remove(constFuncion);
        return { message: 'Deleted' };
    }
}