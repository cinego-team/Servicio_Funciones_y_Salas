import {
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaService } from '../sala/sala.service';
import { FormatoService } from '../formato/formato.service';
import { EstadoDisponibilidadButacaService } from '../estado-disponibilidad-butaca/estado-disponibilidad-butaca.service';
import { DisponibilidadButacaService } from '../disponibilidad-butaca/disponibilidad-butaca.service';
import { Funcion } from '../entities/funcion.entity';
import { Sala } from '../entities/sala.entity';
import { Formato } from '../entities/formato.entity';
import { Butaca } from '../entities/butaca.entity';
import { EstadoButacaEnum } from '../entities/estadoDisponibilidadButaca.entity';
import {
    ButacasDetalleResponse,
    FuncionInput,
    FuncionInputAdmin,
    FuncionResponse,
    FuncionResponseAdmin,
} from './dto';
import { axiosAPIPeliculas } from '../axios_service/axios.client';
import { config } from '../axios_service/env';
import { IdiomaService } from '../idioma/idioma.service';
import { DisponibilidadButaca } from '../entities/disponibilidadButaca.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class FuncionService {
    constructor(
        @InjectRepository(Funcion)
        private funcionRepo: Repository<Funcion>,
        @Inject(forwardRef(() => SalaService))
        private readonly salaService: SalaService,
        private readonly formatoService: FormatoService,
        private readonly estadoDisponibilidadService: EstadoDisponibilidadButacaService,
        private readonly idiomaService: IdiomaService,
        @Inject(forwardRef(() => DisponibilidadButacaService))
        private readonly disponibilidadButacaService: DisponibilidadButacaService,
        @InjectRepository(DisponibilidadButaca)
        private disponibilidadButacaRepo: Repository<DisponibilidadButaca>,
    ) {}
    /**
    async newFuncion(datos: FuncionInput): Promise<FuncionResponse> {
        try {
            const constFormato: Formato | null =
                await this.formatoService.getFormatoById(datos.formatoId);
            if (!constFormato)
                throw new NotFoundException('Formato not found.');

            const constSala: Sala | null = await this.salaService.getSalaById(
                datos.salaId,
            );
            if (!constSala) throw new NotFoundException('Sala not found.');

            const butacasAsignadas: number[] | null =
                await this.salaService.getButacasIdBySalaId(constSala.id);

            if (!butacasAsignadas || butacasAsignadas.length === 0) {
                throw new NotFoundException(
                    `No butacas found for Sala ID ${constSala.id}`,
                );
            }

            const estadoDisponibilidad =
                await this.estadoDisponibilidadService.getByEnum(
                    EstadoButacaEnum.DISPONIBLE,
                );

            if (!estadoDisponibilidad)
                throw new NotFoundException(
                    'EstadoDisponibilidadButaca not found.',
                );

            const constFuncion = this.funcionRepo.create({
                fecha: new Date(datos.fecha),
                estaDisponible: false,
                peliculaId: datos.peliculaId,
                sala: constSala,
                formato: constFormato,
                usuarioId: datos.usuarioId, //revisar
            });
            await this.funcionRepo.save(constFuncion);

            const butacasDisponibilidadACrear = butacasAsignadas.map(
                (butacaId) => {
                    return this.disponibilidadButacaService.createDisponibilidadButaca(
                        {
                            funcion: { id: constFuncion.id } as Funcion,
                            butaca: { id: butacaId } as Butaca,
                            estadoDisponibilidadButaca: estadoDisponibilidad,
                        },
                    );
                },
            );

            await this.disponibilidadButacaService.saveArray(
                butacasDisponibilidadACrear,
            );

            constFuncion.estaDisponible = true;
            await this.funcionRepo.save(constFuncion);

            const funcionConRelaciones = await this.funcionRepo.findOne({
                where: { id: constFuncion.id },
                relations: ['disponibilidadButaca', 'sala', 'formato'],
            });

            if (!funcionConRelaciones) {
                throw new InternalServerErrorException(
                    'Funcion created but not found on reload',
                );
            }

            const response: FuncionResponse = {
                id: funcionConRelaciones.id,
                estaDisponible: funcionConRelaciones.estaDisponible,
                fecha: funcionConRelaciones.fecha,
                peliculaId: funcionConRelaciones.peliculaId,
                sala: funcionConRelaciones.sala,
                formato: funcionConRelaciones.formato,
                usuarioId: funcionConRelaciones.usuarioId,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error creating new Funcion',
                error,
            );
        }
    }

    async findOne(id: number): Promise<FuncionResponse> {
        try {
            const constFuncion: Funcion | null = await this.funcionRepo.findOne(
                {
                    where: { id },
                    relations: {
                        sala: true,
                        formato: true,
                        idioma: true,
                    },
                },
            );

            if (!constFuncion)
                throw new NotFoundException('Funcion not found.');

            const response: FuncionResponse = {
                id: constFuncion.id,
                estaDisponible: constFuncion.estaDisponible,
                fecha: constFuncion.fecha,
                hora: constFuncion.hora,
                peliculaId: constFuncion.peliculaId,
                sala: constFuncion.sala,
                formato: constFuncion.formato,
                idioma: constFuncion.idioma,
                usuarioId: constFuncion.usuarioId,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error fetching Funcion by ID',
                error,
            );
        }
    }
        

    async updateFuncion(
        id: number,
        datos: Partial<FuncionInput>,
    ): Promise<FuncionResponse> {
        try {
            const constFuncion = await this.funcionRepo.findOne({
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
            if (!constFuncion) throw new Error('404 Funcion not found.');

            if (datos.estaDisponible) {
                constFuncion.estaDisponible = datos.estaDisponible;
            }

            if (datos.fecha) {
                constFuncion.fecha = new Date(datos.fecha);
            }

            if (datos.peliculaId) {
                constFuncion.peliculaId = datos.peliculaId;
            }

            if (datos.salaId) {
                const constSala = await this.salaService.getSalaById(
                    datos.salaId,
                );
                if (!constSala) throw new NotFoundException('Sala not found.');
                constFuncion.sala = constSala;
            }

            if (datos.formatoId) {
                const constFormato = await this.formatoService.getFormatoById(
                    datos.formatoId,
                );
                if (!constFormato)
                    throw new NotFoundException('Formato not found.');
                constFuncion.formato = constFormato;
            }

            if (datos.usuarioId) {
                constFuncion.usuarioId = datos.usuarioId;
            }

            await this.funcionRepo.save(constFuncion);

            const response: FuncionResponse = {
                id: constFuncion.id,
                estaDisponible: constFuncion.estaDisponible,
                fecha: constFuncion.fecha,
                peliculaId: constFuncion.peliculaId,
                sala: constFuncion.sala,
                formato: constFuncion.formato,
                usuarioId: constFuncion.usuarioId,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error updating Funcion',
                error,
            );
        }
    }
        */

    async getFuncionesByPeliculaId(
        peliculaId: number,
    ): Promise<FuncionResponseAdmin[]> {
        const funciones = await this.funcionRepo.find({
            where: { peliculaId },
            relations: {
                idioma: true,
                sala: true,
                formato: true,
                disponibilidadButaca: {
                    butaca: true,
                    estadoDisponibilidadButaca: true,
                },
            },
        });

        if (!funciones.length) {
            throw new NotFoundException(
                'No se encontraron funciones para esta película.',
            );
        }

        return funciones.map((funcion) => ({
            id: funcion.id,
            estaDisponible: funcion.estaDisponible,
            fecha: funcion.fecha,
            hora: funcion.hora,
            peliculaId: funcion.peliculaId,
            idioma: funcion.idioma,
            sala: funcion.sala,
            formato: funcion.formato,
            disponibilidadButaca: funcion.disponibilidadButaca,
            usuarioId: funcion.usuarioId,
        }));
    }

    async deleteFuncionById(id: number): Promise<{ message: string }> {
        const funcion = await this.funcionRepo.findOne({
            where: { id },
            relations: ['disponibilidadButaca'], // Cargar las butacas asociadas
        });

        if (!funcion) {
            throw new NotFoundException(`Función con ID ${id} no encontrada`);
        }

        // Primero eliminar las disponibilidades de butaca asociadas
        if (
            funcion.disponibilidadButaca &&
            funcion.disponibilidadButaca.length > 0
        ) {
            await this.disponibilidadButacaRepo.remove(
                funcion.disponibilidadButaca,
            );
        }

        // Luego eliminar la función
        await this.funcionRepo.remove(funcion);

        return { message: `Función ${id} eliminada correctamente` };
    }

    async getButacasDetails(id: number): Promise<ButacasDetalleResponse> {
        const constFuncion = await this.funcionRepo.findOne({
            where: { id },
            relations: [
                'disponibilidadButaca',
                'disponibilidadButaca.estadoDisponibilidadButaca',
                'disponibilidadButaca.butaca',
                'disponibilidadButaca.butaca.fila',
                'disponibilidadButaca.butaca.fila.sala',
            ],
        });

        if (!constFuncion) {
            throw new NotFoundException('Función no encontrada.');
        }

        if (constFuncion.estaDisponible === false) {
            throw new NotFoundException('La función no está disponible.');
        }

        const response: ButacasDetalleResponse = {
            disponibilidadButaca: constFuncion.disponibilidadButaca,
        };
        return response;
    }

    async getFuncionById(id: number): Promise<Funcion> {
        try {
            const funcion = await this.funcionRepo.findOne({ where: { id } });
            if (!funcion) {
                throw new NotFoundException(
                    `Función con id ${id} no encontrada`,
                );
            }
            return funcion;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener la función por ID',
                error,
            );
        }
    }
    async getFunciones(): Promise<FuncionResponseAdmin[]> {
        try {
            const funciones = await this.funcionRepo.find({
                relations: ['idioma', 'sala', 'formato'],
            });

            return funciones.map((funcion) => ({
                id: funcion.id,
                peliculaId: funcion.peliculaId,
                fecha: funcion.fecha,
                hora: funcion.hora,
                estaDisponible: funcion.estaDisponible,

                idioma: funcion.idioma
                    ? {
                          id: funcion.idioma.id,
                          nombre: funcion.idioma.nombre,
                      }
                    : null,

                sala: funcion.sala
                    ? {
                          id: funcion.sala.id,
                          nroSala: funcion.sala.nroSala,
                      }
                    : null,

                formato: funcion.formato
                    ? {
                          id: funcion.formato.id,
                          nombre: funcion.formato.nombre,
                          precio: funcion.formato.precio,
                      }
                    : null,
                usuarioId: funcion.usuarioId,
            }));
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener las funciones',
            );
        }
    }
    async getFuncById(id: number): Promise<{
        id: number;
        peliculaId: number;
        fecha: Date;
        hora: string;
        estaDisponible: boolean;
        sala: {
            id: number;
            nroSala: number;
        };
        idioma: {
            id: number;
            nombre: string;
        };
        formato: {
            id: number;
            nombre: string;
            precio: number;
        };
        usuarioId: number;
    }> {
        const funcion = await this.funcionRepo.findOne({
            where: { id },
            relations: ['sala', 'idioma', 'formato'],
        });

        if (!funcion) throw new NotFoundException('Función no encontrada');

        return {
            id: funcion.id,
            peliculaId: funcion.peliculaId,
            fecha: funcion.fecha,
            hora: funcion.hora,
            estaDisponible: funcion.estaDisponible,
            sala: {
                id: funcion.sala.id,
                nroSala: funcion.sala.nroSala,
            },
            idioma: {
                id: funcion.idioma.id,
                nombre: funcion.idioma.nombre,
            },
            formato: {
                id: funcion.formato.id,
                nombre: funcion.formato.nombre,
                precio: funcion.formato.precio,
            },
            usuarioId: funcion.usuarioId,
        };
    }
    async createFuncionAdmin(
        dto: FuncionInputAdmin,
        userId: number,
    ): Promise<FuncionResponseAdmin> {
        const peliculaResp = await axiosAPIPeliculas.get(
            config.APIPeliculasUrls.getPeliculaById(dto.peliculaId),
        );

        if (!peliculaResp) {
            throw new NotFoundException(
                'La película no existe (API Gateway) error giane',
            );
        }

        const sala = await this.salaService.getSalaById(dto.sala.id);
        const idioma = await this.idiomaService.getIdiomaById(dto.idioma.id);
        const formato = await this.formatoService.findOne(dto.formato.id);

        const funcion = this.funcionRepo.create({
            peliculaId: dto.peliculaId,
            fecha: dto.fecha,
            hora: dto.hora,
            estaDisponible: false,  // Inicialmente false hasta crear las butacas
            sala,
            idioma,
            formato,
            usuarioId: userId,
        });

        const saved = await this.funcionRepo.save(funcion);

        // ===== AGREGAR ESTO: Crear disponibilidades de butaca =====
        const butacasAsignadas = await this.salaService.getButacasIdBySalaId(sala.id);

        if (butacasAsignadas && butacasAsignadas.length > 0) {
            const estadoDisponibilidad = await this.estadoDisponibilidadService.getByEnum(
                EstadoButacaEnum.DISPONIBLE,
            );

            if (!estadoDisponibilidad) {
                throw new NotFoundException('EstadoDisponibilidadButaca DISPONIBLE no encontrado.');
            }

            const butacasDisponibilidadACrear = butacasAsignadas.map((butacaId) => {
                return this.disponibilidadButacaService.createDisponibilidadButaca({
                    funcion: { id: saved.id } as Funcion,
                    butaca: { id: butacaId } as Butaca,
                    estadoDisponibilidadButaca: estadoDisponibilidad,
                });
            });

            await this.disponibilidadButacaService.saveArray(butacasDisponibilidadACrear);
        }

        // Actualizar la funcion a disponible
        saved.estaDisponible = dto.estaDisponible ?? true;
        await this.funcionRepo.save(saved);
        // ===== FIN DE LO AGREGADO =====

        return {
            id: saved.id,
            peliculaId: saved.peliculaId,
            fecha: saved.fecha,
            hora: saved.hora,
            estaDisponible: saved.estaDisponible,
            sala: {
                id: sala.id,
                nroSala: sala.nroSala,
            },
            idioma: {
                id: idioma.id,
                nombre: idioma.nombre,
            },
            formato: {
                id: formato.id,
                nombre: formato.nombre,
                precio: formato.precio,
            },
            usuarioId: userId,
        };
    }
    
    async updateFuncionAdmin(
        id: number,
        dto: Partial<FuncionInputAdmin>,
    ): Promise<FuncionResponseAdmin> {
        const funcion = await this.funcionRepo.findOne({
            where: { id },
            relations: ['sala', 'idioma', 'formato'],
        });

        if (!funcion) {
            throw new NotFoundException('La función no existe');
        }

        // Actualizamos película si viene
        if (dto.peliculaId) {
            const peliculaResp = await axiosAPIPeliculas
                .get(config.APIPeliculasUrls.getPeliculaById(dto.peliculaId))
                .catch(() => null);

            if (!peliculaResp) {
                throw new NotFoundException(
                    'La película no existe (API Gateway)',
                );
            }

            funcion.peliculaId = dto.peliculaId;
        }

        // Actualizamos relaciones
        if (dto.sala?.id) {
            funcion.sala = await this.salaService.getSalaById(dto.sala.id);
        }

        if (dto.idioma?.id) {
            funcion.idioma = await this.idiomaService.getIdiomaByIdForPut(
                dto.idioma.id,
            );
        }

        if (dto.formato?.id) {
            funcion.formato = await this.formatoService.findOneFormatoForPut(
                dto.formato.id,
            );
        }

        // Campos simples
        if (dto.fecha !== undefined) funcion.fecha = dto.fecha;
        if (dto.hora !== undefined) funcion.hora = dto.hora;
        if (dto.estaDisponible !== undefined) {
            funcion.estaDisponible =
                typeof dto.estaDisponible === 'string'
                    ? dto.estaDisponible === 'true'
                    : dto.estaDisponible;
        }

        // Guardamos
        const saved = await this.funcionRepo.save(funcion);

        // Devolvemos en formato FuncionResponseAdmin
        return {
            id: saved.id,
            peliculaId: saved.peliculaId,
            fecha: saved.fecha,
            hora: saved.hora,
            estaDisponible: saved.estaDisponible,
            sala: saved.sala
                ? { id: saved.sala.id, nroSala: saved.sala.nroSala }
                : null,
            idioma: saved.idioma
                ? { id: saved.idioma.id, nombre: saved.idioma.nombre }
                : null,
            formato: saved.formato
                ? {
                      id: saved.formato.id,
                      nombre: saved.formato.nombre,
                      precio: saved.formato.precio,
                  }
                : null,
            usuarioId: saved.usuarioId,
        };
    }
}
