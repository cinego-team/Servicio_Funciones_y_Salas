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
                    },
                },
            );

            if (!constFuncion)
                throw new NotFoundException('Funcion not found.');

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
            relations: ['disponibilidadButaca'],  // Cargar las butacas asociadas
        });
        
        if (!funcion) {
            throw new NotFoundException(`Función con ID ${id} no encontrada`);
        }
        
        // Primero eliminar las disponibilidades de butaca asociadas
        if (funcion.disponibilidadButaca && funcion.disponibilidadButaca.length > 0) {
            await this.disponibilidadButacaRepo.remove(funcion.disponibilidadButaca);
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
        };
    }
    async createFuncionAdmin(dto: FuncionInputAdmin, token: string): Promise<FuncionResponseAdmin> {
    
    // Extraer usuario_id del token
    const tokenSinBearer = token.replace('Bearer ', '');
    const decoded = jwt.decode(tokenSinBearer) as { sub: string };
    const usuarioId = parseInt(decoded.sub);

    const peliculaResp = await axiosAPIPeliculas
        .get(config.APIPeliculasUrls.getPeliculaById(dto.peliculaId), {
            headers: { Authorization: token }
        })
        .catch((error) => {
            return null;
        });

    if (!peliculaResp) {
        throw new NotFoundException('La película no existe (API Gateway)');
    }

    const sala = await this.salaService.getSalaById(dto.sala.id);
    const idioma = await this.idiomaService.getIdiomaById(dto.idioma.id);
    const formato = await this.formatoService.findOne(dto.formato.id);
    
    const funcion = this.funcionRepo.create({
        peliculaId: dto.peliculaId,
        fecha: dto.fecha,
        estaDisponible: dto.estaDisponible,
        sala,
        idioma,
        formato,
        usuarioId: usuarioId, // <-- Agregado: asigna el usuario que crea la funcion
    });
    
    const saved = await this.funcionRepo.save(funcion);
    
    return {
        id: saved.id,
        peliculaId: saved.peliculaId,
        fecha: saved.fecha,
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

        if (dto.sala?.id) {
            const sala = await this.salaService.getSalaById(dto.sala.id);
            funcion.sala = sala;
        }

        if (dto.idioma?.id) {
            const idiomaEntity = await this.idiomaService.getIdiomaByIdForPut(
                dto.idioma.id,
            );
            funcion.idioma = idiomaEntity;
        }

        if (dto.formato?.id) {
            const formatoEntity =
                await this.formatoService.findOneFormatoForPut(dto.formato.id);
            funcion.formato = formatoEntity;
        }
        if (dto.fecha !== undefined) {
            funcion.fecha = dto.fecha;
        }

        if (dto.estaDisponible !== undefined) {
            funcion.estaDisponible =
                typeof dto.estaDisponible === 'string'
                    ? dto.estaDisponible === 'true'
                    : dto.estaDisponible;
        }

        await this.funcionRepo.save(funcion);
        return funcion;
    }
}
