import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { ButacasDetalleResponse, FuncionInput, FuncionResponse } from './dto';

@Injectable()
export class FuncionService {

    constructor(
        @InjectRepository(Funcion)
        private funcionRepo: Repository<Funcion>,
        @Inject(forwardRef(() => SalaService))
        private readonly salaService: SalaService,
        private readonly formatoService: FormatoService,
        private readonly estadoDisponibilidadService: EstadoDisponibilidadButacaService,
        @Inject(forwardRef(() => DisponibilidadButacaService))
        private readonly disponibilidadButacaService: DisponibilidadButacaService,
    ) { }

    async newFuncion(datos: FuncionInput): Promise<FuncionResponse> {
        try {
            const constFormato: Formato | null = await this.formatoService.getFormatoById(datos.formatoId);
            if (!constFormato) throw new NotFoundException("Formato not found.");

            const constSala: Sala | null = await this.salaService.getSalaById(datos.salaId);
            if (!constSala) throw new NotFoundException("Sala not found.");


            const butacasAsignadas: number[] | null = await this.salaService.getButacasIdBySalaId(constSala.id);

            if (!butacasAsignadas || butacasAsignadas.length === 0) {
                throw new NotFoundException(`No butacas found for Sala ID ${constSala.id}`);
            }

            const estadoDisponibilidad = await this.estadoDisponibilidadService.getByEnum(EstadoButacaEnum.DISPONIBLE);

            if (!estadoDisponibilidad) throw new NotFoundException("EstadoDisponibilidadButaca not found.");

            const constFuncion = this.funcionRepo.create({
                fecha: new Date(datos.fecha),
                estaDisponible: false,
                peliculaId: datos.peliculaId,
                sala: constSala,
                formato: constFormato,
                usuarioId: datos.usuarioId, //revisar
            });
            await this.funcionRepo.save(constFuncion);

            const butacasDisponibilidadACrear = butacasAsignadas.map(butacaId => {
                return this.disponibilidadButacaService.createDisponibilidadButaca({
                    funcion: { id: constFuncion.id } as Funcion,
                    butaca: { id: butacaId } as Butaca,
                    estadoDisponibilidadButaca: estadoDisponibilidad,
                });
            });

            await this.disponibilidadButacaService.saveArray(butacasDisponibilidadACrear);

            constFuncion.estaDisponible = true;
            await this.funcionRepo.save(constFuncion);

            const funcionConRelaciones = await this.funcionRepo.findOne({
                where: { id: constFuncion.id },
                relations: ['disponibilidadButaca', 'sala', 'formato'],
            });

            if (!funcionConRelaciones) {
                throw new InternalServerErrorException('Funcion created but not found on reload');
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
            throw new InternalServerErrorException('Error creating new Funcion', error);
        }
    }

    async findOne(id: number): Promise<FuncionResponse> {
        try {
            const constFuncion: Funcion | null = await this.funcionRepo.findOne({
                where: { id },
                relations: {
                    sala: true,
                    formato: true
                },
            });

            if (!constFuncion) throw new NotFoundException('Funcion not found.');

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
            throw new InternalServerErrorException('Error fetching Funcion by ID', error);
        }
    }

    async updateFuncion(id: number, datos: Partial<FuncionInput>): Promise<FuncionResponse> {
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
                const constSala = await this.salaService.getSalaById(datos.salaId);
                if (!constSala) throw new NotFoundException('Sala not found.');
                constFuncion.sala = constSala;
            }

            if (datos.formatoId) {
                const constFormato = await this.formatoService.getFormatoById(datos.formatoId);
                if (!constFormato) throw new NotFoundException('Formato not found.');
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
            throw new InternalServerErrorException('Error updating Funcion', error);
        }
    }

    async getFuncionesByPeliculaId(id: number): Promise<FuncionResponse[]> {
        try {
            const funciones = await this.funcionRepo.find({
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

            if (!funciones || funciones.length === 0) {
                throw new NotFoundException('No se encontraron funciones para esta película.');
            }

            return funciones.map(funcion => ({
                id: funcion.id,
                estaDisponible: funcion.estaDisponible,
                fecha: funcion.fecha,
                peliculaId: funcion.peliculaId,
                sala: funcion.sala,
                formato: funcion.formato,
                disponibilidadButaca: funcion.disponibilidadButaca,
                usuarioId: funcion.usuarioId,
            }));
        } catch (error) {
            throw new InternalServerErrorException('Error fetching Funciones by Pelicula ID', error);
        }
    }

    async deleteFuncionById(id: number): Promise<{ message: string }> {
        try {
            const constFuncion = await this.funcionRepo.findOne({ where: { id } });
            if (!constFuncion) throw new NotFoundException('Funcion not found.');

            await this.funcionRepo.remove(constFuncion);

            return { message: 'Deleted' };
        } catch (error) {
            throw new InternalServerErrorException('Error deleting Funcion', error);
        }
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
                throw new NotFoundException(`Función con id ${id} no encontrada`);
            }
            return funcion;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la función por ID', error);
        }
    }
}