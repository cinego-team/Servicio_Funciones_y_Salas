import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoDisponibilidadButaca } from '../entities/estadoDisponibilidadButaca.entity';
import { EstadoButacaEnum } from '../entities/estadoDisponibilidadButaca.entity';
import { EstadoDisponibilidadInput, EstadoDisponibilidadResponse } from './dto';

@Injectable()
export class EstadoDisponibilidadButacaService {
    constructor(
        @InjectRepository(EstadoDisponibilidadButaca)
        private readonly estadoRepo: Repository<EstadoDisponibilidadButaca>,
    ) { }

    async create(input: EstadoDisponibilidadInput): Promise<EstadoDisponibilidadResponse> {
        try {
            const estado = this.estadoRepo.create({ nombre: input.nombre });
            const saved = await this.estadoRepo.save(estado);
            const response: EstadoDisponibilidadResponse = {
                id: saved.id,
                nombre: saved.nombre,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el estado de disponibilidad de butaca');
        }
    }

    async findAll(): Promise<EstadoDisponibilidadResponse[]> {
        try {
            const estados = await this.estadoRepo.find();
            if (!estados || estados.length === 0) {
                throw new NotFoundException('No se encontraron estados de disponibilidad de butaca');
            }
            const response: EstadoDisponibilidadResponse[] = estados.map(estado => ({
                id: estado.id,
                nombre: estado.nombre,
            }));
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener los estados de disponibilidad de butaca');
        }
    }

    async findOne(id: number): Promise<EstadoDisponibilidadResponse> {
        try {
            const estado = await this.estadoRepo.findOne({ where: { id } });
            if (!estado) throw new NotFoundException(`Estado con id ${id} no encontrado`);
            const response: EstadoDisponibilidadResponse = {
                id: estado.id,
                nombre: estado.nombre,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error al obtener el estado con id ${id}`);
        }
    }

    async update(id: number, input: EstadoDisponibilidadInput): Promise<EstadoDisponibilidadResponse> {
        try {
            const estado = await this.estadoRepo.findOne({ where: { id } });
            if (!estado) throw new NotFoundException(`Estado con id ${id} no encontrado`);

            if (input.nombre) {
                estado.nombre = input.nombre;
            }

            await this.estadoRepo.save(estado);

            const response: EstadoDisponibilidadResponse = {
                id: estado.id,
                nombre: estado.nombre,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error al actualizar el estado con id ${id}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.estadoRepo.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Estado con id ${id} no encontrado`);
            }
        } catch (error) {
            throw new InternalServerErrorException(`Error al eliminar el estado con id ${id}`);
        }
    }

    async getByEnum(nombre: EstadoButacaEnum): Promise<EstadoDisponibilidadButaca> {
        try {
            const estado = await this.estadoRepo.findOne({
                where: { nombre },
            });
            if (!estado) {
                throw new NotFoundException(`EstadoDisponibilidadButaca with name ${nombre} not found`);
            }
            return estado;
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving EstadoDisponibilidadButaca by name');
        }
    }

    async getEstadoByNombre(nombre: EstadoButacaEnum): Promise<EstadoDisponibilidadButaca> {
        try {
            const estado = await this.estadoRepo.findOne({ where: { nombre } });
            if (!estado) throw new NotFoundException(`Estado con nombre ${nombre} no encontrado`);
            return estado;
        } catch (error) {
            throw new NotFoundException(`Error al obtener el estado con nombre ${nombre}`);
        }
    }
}