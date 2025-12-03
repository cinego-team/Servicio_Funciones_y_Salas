
import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EstadoDisponibilidadButacaService } from '../estado-disponibilidad-butaca/estado-disponibilidad-butaca.service';
import { FuncionService } from '../funcion/funcion.service';
import { ButacaService } from '../butaca/butaca.service';
import { DisponibilidadButaca } from '../entities/disponibilidadButaca.entity';
import { Funcion } from '../entities/funcion.entity';
import { Butaca } from '../entities/butaca.entity';
import { EstadoDisponibilidadButaca, EstadoButacaEnum } from '../entities/estadoDisponibilidadButaca.entity';
import { DisponibilidadButacaInput, DisponibilidadButacaResponse } from './dto';

@Injectable()
export class DisponibilidadButacaService {
    constructor(
        @InjectRepository(DisponibilidadButaca)
        private readonly disponibilidadRepo: Repository<DisponibilidadButaca>,
        @Inject(forwardRef(() => FuncionService))
        private readonly funcionService: FuncionService,
        @Inject(forwardRef(() => ButacaService))
        private readonly butacaService: ButacaService,
        private readonly estadoDisponibilidadService: EstadoDisponibilidadButacaService,
    ) { }

    createDisponibilidadButaca(data: {
        funcion: Funcion;
        butaca: Butaca;
        estadoDisponibilidadButaca: EstadoDisponibilidadButaca;
    }): DisponibilidadButaca {
        try {
            return this.disponibilidadRepo.create({
                funcion: data.funcion,
                butaca: data.butaca,
                estadoDisponibilidadButaca: data.estadoDisponibilidadButaca,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la disponibilidad de butaca');
        }
    }

    async saveArray(disponibilidades: DisponibilidadButaca[]): Promise<DisponibilidadButaca[]> {
        try {
            return await this.disponibilidadRepo.save(disponibilidades);
        } catch (error) {
            throw new InternalServerErrorException('Error al guardar las disponibilidades de butaca');
        }
    }

    async findAll(): Promise<DisponibilidadButacaResponse[]> {
        try {
            const disponibilidades = await this.disponibilidadRepo.find({ relations: ['funcion', 'butaca', 'estadoDisponibilidadButaca'] });

            const response: DisponibilidadButacaResponse[] = disponibilidades.map(d => ({
                id: d.id,
                funcionId: d.funcion.id,
                butacaId: d.butaca.id,
                estadoDisponibilidadButacaId: d.estadoDisponibilidadButaca.nombre as EstadoButacaEnum,
            }));
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las disponibilidades de butaca');
        }
    }

    async findOne(id: number): Promise<DisponibilidadButacaResponse> {
        try {
            const disponibilidad = await this.disponibilidadRepo.findOne({ where: { id }, relations: ['funcion', 'butaca', 'estadoDisponibilidadButaca'] });
            if (!disponibilidad) throw new NotFoundException('Disponibilidad no encontrada');

            const response: DisponibilidadButacaResponse = {
                id: disponibilidad.id,
                funcionId: disponibilidad.funcion.id,
                butacaId: disponibilidad.butaca.id,
                estadoDisponibilidadButacaId: disponibilidad.estadoDisponibilidadButaca.nombre as EstadoButacaEnum,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la disponibilidad de butaca');
        }
    }

    async update(id: number, data: Partial<DisponibilidadButacaInput>): Promise<DisponibilidadButacaResponse> {
        const disponibilidad = await this.disponibilidadRepo.findOne({ where: { id }, relations: ['funcion', 'butaca', 'estadoDisponibilidadButaca'] });
        if (!disponibilidad) throw new NotFoundException('Disponibilidad no encontrada');

        if (data.funcionId) {
            const funcion: Funcion = await this.funcionService.getFuncionById(data.funcionId);
            if (!funcion) throw new NotFoundException('Funcion no encontrada');
            disponibilidad.funcion = funcion;
        }

        if (data.butacaId) {
            const butaca: Butaca = await this.butacaService.getButacaById(data.butacaId);
            if (!butaca) throw new NotFoundException('Butaca no encontrada');
            disponibilidad.butaca = butaca;
        }

        if (data.estadoDisponibilidadButacaId) {
            const estado: EstadoDisponibilidadButaca = await this.estadoDisponibilidadService.getEstadoByNombre(data.estadoDisponibilidadButacaId);
            if (!estado) throw new NotFoundException('Estado no encontrado');
            disponibilidad.estadoDisponibilidadButaca = estado;
        }

        await this.disponibilidadRepo.save(disponibilidad);

        const response: DisponibilidadButacaResponse = {
            id: disponibilidad.id,
            funcionId: disponibilidad.funcion.id,
            butacaId: disponibilidad.butaca.id,
            estadoDisponibilidadButacaId: disponibilidad.estadoDisponibilidadButaca.nombre as EstadoButacaEnum,
        };
        return response;
    }

    async reservarButacas(disponibilidadButacaIds: number[]): Promise<{ actualizadas: number }> {
        try {
            const estadoDisponible = await this.estadoDisponibilidadService.getEstadoByNombre(EstadoButacaEnum.DISPONIBLE);

            if (!estadoDisponible) {
                throw new NotFoundException('Estado DISPONIBLE no encontrado en la base de datos');
            }

            const estadoReservada = await this.estadoDisponibilidadService.getEstadoByNombre(EstadoButacaEnum.RESERVADA);

            if (!estadoReservada) {
                throw new NotFoundException('Estado RESERVADA no encontrado en la base de datos');
            }


            const resultadoUpdate = await this.disponibilidadRepo.update(
                {
                    id: In(disponibilidadButacaIds),
                    estadoDisponibilidadButaca: { id: estadoDisponible.id },
                },
                {
                    estadoDisponibilidadButaca: estadoReservada,
                }
            );
            const actualizadas = resultadoUpdate.affected || 0;
            return {
                actualizadas,
            };
        } catch (error) {
            throw new InternalServerErrorException('Error al reservar las butacas');
        }
    }

    async ocuparButacas(disponibilidadButacaIds: number[]): Promise<{ actualizadas: number }> {
        try {
            const estadoReservada = await this.estadoDisponibilidadService.getEstadoByNombre(EstadoButacaEnum.RESERVADA);

            if (!estadoReservada) {
                throw new NotFoundException('Estado RESERVADA no encontrado en la base de datos');
            }

            const estadoOcupada = await this.estadoDisponibilidadService.getEstadoByNombre(EstadoButacaEnum.OCUPADA);

            if (!estadoOcupada) {
                throw new NotFoundException('Estado OCUPADO no encontrado en la base de datos');
            }

            const resultadoUpdate = await this.disponibilidadRepo.update(
                {
                    id: In(disponibilidadButacaIds),
                    estadoDisponibilidadButaca: { id: estadoReservada.id },
                },
                {
                    estadoDisponibilidadButaca: estadoOcupada,
                }
            );
            const actualizadas = resultadoUpdate.affected || 0;

            return {
                actualizadas,
            };
        } catch (error) {
            throw new InternalServerErrorException('Error al ocupar las butacas');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.disponibilidadRepo.delete(id);
            if (result.affected === 0) throw new NotFoundException('Disponibilidad no encontrada');
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la disponibilidad de butaca');
        }
    }

    async getDisponibilidadById(id: number): Promise<DisponibilidadButaca> {
        try {
            const disponibilidad = await this.disponibilidadRepo.findOne({ where: { id } });
            if (!disponibilidad) {
                throw new NotFoundException(`Disponibilidad de butaca con id ${id} no encontrada`);
            }
            return disponibilidad;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la disponibilidad de butaca por ID');
        }
    }
}