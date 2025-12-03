import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisponibilidadButacaService } from '../disponibilidad-butaca/disponibilidad-butaca.service';
import { FilaService } from '../fila/fila.service';
import { Butaca } from '../entities/butaca.entity';
import { ButacaInput, ButacaResponse } from './dto';

@Injectable()
export class ButacaService {
    constructor(
        @InjectRepository(Butaca)
        private readonly butacaRepository: Repository<Butaca>,
        @Inject(forwardRef(() => FilaService))
        private readonly filaService: FilaService,
        @Inject(forwardRef(() => DisponibilidadButacaService))
        private readonly diponibilidadButacaService: DisponibilidadButacaService,

    ) { }

    createMultipleForFila(cantButacasPorFila: number): Butaca[] {
        try {
            const butacas: Butaca[] = [];
            for (let i = 1; i <= cantButacasPorFila; i++) {
                const butaca = this.butacaRepository.create({
                    nroButaca: i,
                });
                butacas.push(butaca);
            }
            return butacas;
        } catch (error) {
            throw new InternalServerErrorException('Error al crear las butacas para la fila');
        }
    }

    async saveArray(butacas: Butaca[]): Promise<Butaca[]> {
        try {
            return this.butacaRepository.save(butacas);
        } catch (error) {
            throw new InternalServerErrorException('Error al guardar las butacas');
        }
    }

    async findAll(): Promise<ButacaResponse[]> {
        try {
            const butacas: Butaca[] = await this.butacaRepository.find({
                relations: ['fila', 'disponibilidadButaca'],
            });
            if (!butacas) {
                throw new NotFoundException('No se encontraron butacas');
            }

            const response: ButacaResponse[] = butacas.map(butaca => {
                return {
                    id: butaca.id,
                    nroButaca: butaca.nroButaca,
                    fila: butaca.fila,
                    disponibilidadButaca: butaca.disponibilidadButaca,
                };
            });
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las butacas');
        }
    }

    async findOne(id: number): Promise<ButacaResponse> {
        try {
            const butaca = await this.butacaRepository.findOne({
                where: { id },
                relations: ['fila', 'disponibilidadButaca'],
            });
            if (!butaca) throw new NotFoundException(`Butaca con id ${id} no encontrada`);

            const response: ButacaResponse = {
                id: butaca.id,
                nroButaca: butaca.nroButaca,
                fila: butaca.fila,
                disponibilidadButaca: butaca.disponibilidadButaca,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la butaca')
        }
    }

    async update(id: number, input: Partial<ButacaInput>): Promise<ButacaResponse> {
        try {
            const butaca = await this.butacaRepository.findOne({ where: { id } });
            if (!butaca) throw new NotFoundException(`Butaca con id ${id} no encontrada`);

            if (input.nroButaca) {
                butaca.nroButaca = input.nroButaca;
            }

            if (input.filaId) {
                const fila = await this.filaService.getFilaById(input.filaId);
                if (!fila) throw new NotFoundException(`Fila con id ${input.filaId} no encontrada`);
                butaca.fila = fila;
            }

            if (input.disponibilidadId) {
                const disponibilidad = await this.diponibilidadButacaService.getDisponibilidadById(input.disponibilidadId);
                if (!disponibilidad) {
                    throw new NotFoundException(`Disponibilidad con id ${input.disponibilidadId} no encontrada`);
                }
                butaca.disponibilidadButaca = disponibilidad;
            }

            await this.butacaRepository.save(butaca);

            const response: ButacaResponse = {
                id: butaca.id,
                nroButaca: butaca.nroButaca,
                fila: butaca.fila,
                disponibilidadButaca: butaca.disponibilidadButaca,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la butaca');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.butacaRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Butaca con id ${id} no encontrada`);
            }
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la butaca');
        }
    }

    async getButacaById(id: number): Promise<Butaca> {
        try {
            const butaca = await this.butacaRepository.findOne({ where: { id } });
            if (!butaca) {
                throw new NotFoundException(`Butaca con id ${id} no encontrada`);
            }
            return butaca;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la butaca');
        }
    }
}