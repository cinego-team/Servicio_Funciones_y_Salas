import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fila } from '../entities/fila.entity';
import { FilaInput, FilaResponse } from './dto';
import { Sala } from '../entities/sala.entity';

@Injectable()
export class FilaService {
    constructor(
        @InjectRepository(Fila)
        private readonly filaRepository: Repository<Fila>,
        @InjectRepository(Sala)
        private readonly salaRepository: Repository<Sala>,
    ) { }

    // 1. Crear fila
    async create(filaInput: FilaInput): Promise<FilaResponse> {
        const sala = await this.salaRepository.findOne({ where: { id: filaInput.salaId } });
        if (!sala) throw new NotFoundException('Sala no encontrada');

        const fila = this.filaRepository.create({
            letraFila: filaInput.letraFila,
            sala,
        });

        const savedFila = await this.filaRepository.save(fila);

        return this.mapToResponse(savedFila);
    }

    // 2. Listar todas las filas
    async findAll(): Promise<FilaResponse[]> {
        const filas = await this.filaRepository.find({ relations: ['sala', 'butacas'] });
        return filas.map(f => this.mapToResponse(f));
    }

    // 3. Buscar fila por id
    async findOne(id: number): Promise<FilaResponse> {
        const fila = await this.filaRepository.findOne({
            where: { id },
            relations: ['sala', 'butacas']
        });
        if (!fila) throw new NotFoundException('Fila no encontrada');

        return this.mapToResponse(fila);
    }

    // 4. Actualizar fila
    async update(id: number, filaInput: FilaInput): Promise<FilaResponse> {
        const fila = await this.filaRepository.findOne({ where: { id }, relations: ['sala'] });
        if (!fila) throw new NotFoundException('Fila no encontrada');

        if (filaInput.salaId) {
            const sala = await this.salaRepository.findOne({ where: { id: filaInput.salaId } });
            if (!sala) throw new NotFoundException('Sala no encontrada');
            fila.sala = sala;
        }

        fila.letraFila = filaInput.letraFila ?? fila.letraFila;

        const updatedFila = await this.filaRepository.save(fila);
        return this.mapToResponse(updatedFila);
    }

    // 5. Eliminar fila
    async remove(id: number): Promise<void> {
        const fila = await this.filaRepository.findOne({ where: { id } });
        if (!fila) throw new NotFoundException('Fila no encontrada');
        await this.filaRepository.remove(fila);
    }

    // Helper para mapear al FilaResponse
    private mapToResponse(fila: Fila): FilaResponse {
        return {
            id: fila.id,
            letraFila: fila.letraFila,
            sala: {
                nroSala: fila.sala.nroSala,
            },
            butacas: fila.butaca?.map(b => ({
                id: b.id,
                nroButaca: b.nroButaca,
                estadoDisponibilidadButaca: b.disponibilidadButaca?.estadoDisponibilidadButaca.nombre,
            })),
        };
    }
}