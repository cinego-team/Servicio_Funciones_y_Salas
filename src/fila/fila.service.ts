import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ButacaService } from '../butaca/butaca.service';
import { Butaca } from '../entities/butaca.entity';
import { SalaService } from '../sala/sala.service';
import { Fila } from '../entities/fila.entity';
import { Sala } from '../entities/sala.entity';
import { FilaInput, FilaResponse } from './dto';

@Injectable()
export class FilaService {
    constructor(
        @InjectRepository(Fila)
        private readonly filaRepository: Repository<Fila>,
        @Inject(forwardRef(() => ButacaService))
        private readonly butacaService: ButacaService,
        @Inject(forwardRef(() => SalaService))
        private readonly salaService: SalaService,
    ) { }

    async createMultiple(cantFilas: number, cantButacasPorFila: number): Promise<Fila[]> {
        try {
            const filas: Fila[] = [];
            const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let i = 0; i < cantFilas; i++) {
                const butacasACrear: Butaca[] = this.butacaService.createMultipleForFila(cantButacasPorFila);
                await this.butacaService.saveArray(butacasACrear);
                const fila = this.filaRepository.create({
                    letraFila: letras[i],
                    butacas: butacasACrear,
                });
                filas.push(fila);
            }
            return filas;
        } catch (error) {
            throw new InternalServerErrorException('Error al crear las filas y butacas');
        }
    }

    async saveArray(filas: Fila[]): Promise<Fila[]> {
        try {
            return this.filaRepository.save(filas);
        } catch (error) {
            throw new InternalServerErrorException('Error al guardar las filas');
        }
    }

    async findAll(): Promise<FilaResponse[]> {
        try {
            const filas = await this.filaRepository.find({ relations: ['sala', 'butacas'] });
            const response: FilaResponse[] = filas.map(f => {
                return {
                    id: f.id,
                    letraFila: f.letraFila,
                    sala: f.sala,
                    butacas: f.butacas
                };
            });
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las filas');
        }
    }

    async findOne(id: number): Promise<FilaResponse> {
        try {
            const fila = await this.filaRepository.findOne({
                where: { id },
                relations: ['sala', 'butacas']
            });
            if (!fila) {
                throw new NotFoundException('Fila no encontrada');
            }

            const response: FilaResponse = {
                id: fila.id,
                letraFila: fila.letraFila,
                sala: fila.sala,
                butacas: fila.butacas,
            }
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la fila');
        }
    }

    async update(id: number, filaInput: Partial<FilaInput>): Promise<FilaResponse> {
        try {
            const fila = await this.filaRepository.findOne({
                where: { id },
                relations: ['sala']
            });

            if (!fila) {
                throw new NotFoundException('Fila no encontrada');
            }

            if (filaInput.salaId) {
                const sala: Sala | null = await this.salaService.getSalaById(filaInput.salaId);
                if (!sala) throw new NotFoundException('Sala no encontrada');
                fila.sala = sala;
            }

            if (filaInput.letraFila) {
                fila.letraFila = filaInput.letraFila;
            }

            const updatedFila = await this.filaRepository.save(fila);

            const response: FilaResponse = {
                id: updatedFila.id,
                letraFila: updatedFila.letraFila,
                sala: updatedFila.sala,
                butacas: updatedFila.butacas,
            }
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la fila');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.filaRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Fila no encontrada');
            }
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la fila');
        }
    }

    async getFilaById(id: number): Promise<Fila | null> {
        try {
            const fila = await this.filaRepository.findOne({ where: { id }, relations: ['sala'] });
            return fila;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la fila por id');
        }
    }
}