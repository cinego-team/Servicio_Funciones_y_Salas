import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Butaca } from '../entities/butaca.entity';
import { Fila } from '../entities/fila.entity';
import { DisponibilidadButaca } from '../entities/disponibilidadButaca.entity';
import { ButacaInput, ButacaResponse } from './dto';

@Injectable()
export class ButacaService {
    constructor(
        @InjectRepository(Butaca)
        private readonly butacaRepository: Repository<Butaca>,

        @InjectRepository(Fila)
        private readonly filaRepository: Repository<Fila>,

        @InjectRepository(DisponibilidadButaca)
        private readonly disponibilidadRepository: Repository<DisponibilidadButaca>,
    ) { }

    createMultipleForFila(cantButacasPorFila: number): Butaca[] {
        const butacas: Butaca[] = [];
        for (let i = 1; i <= cantButacasPorFila; i++) {
            const butaca = this.butacaRepository.create({
                nroButaca: i,
            });
            butacas.push(butaca);
        }
        return butacas;
    }

    async saveArray(butacas: Butaca[]): Promise<Butaca[]> {
        return this.butacaRepository.save(butacas);
    }

    // 🟢 FIND ALL
    async findAll(): Promise<ButacaResponse[]> {
        const butacas = await this.butacaRepository.find({
            relations: ['fila', 'disponibilidadButaca', 'disponibilidadButaca.estado'],
        });
        return butacas.map((b) => this.toResponse(b));
    }

    // 🟢 FIND ONE
    async findOne(id: number): Promise<ButacaResponse> {
        const butaca = await this.butacaRepository.findOne({
            where: { id },
            relations: ['fila', 'disponibilidadButaca', 'disponibilidadButaca.estado'],
        });
        if (!butaca) throw new NotFoundException(`Butaca con id ${id} no encontrada`);

        return this.toResponse(butaca);
    }

    // 🟢 UPDATE
    async update(id: number, input: ButacaInput): Promise<ButacaResponse> {
        const butaca = await this.butacaRepository.findOne({ where: { id } });
        if (!butaca) throw new NotFoundException(`Butaca con id ${id} no encontrada`);

        if (input.nroButaca) {
            butaca.nroButaca = input.nroButaca;
        }

        if (input.filaId) {
            const fila = await this.filaRepository.findOne({ where: { id: input.filaId } });
            if (!fila) throw new NotFoundException(`Fila con id ${input.filaId} no encontrada`);
            butaca.fila = fila;
        }

        if (input.disponibilidadId) {
            const disponibilidad = await this.disponibilidadRepository.findOne({
                where: { id: input.disponibilidadId },
                relations: ['estado'],
            });
            if (!disponibilidad) {
                throw new NotFoundException(`Disponibilidad con id ${input.disponibilidadId} no encontrada`);
            }
            butaca.disponibilidadButaca = disponibilidad;
        }

        const updated = await this.butacaRepository.save(butaca);
        return this.toResponse(updated);
    }

    // 🟢 REMOVE
    async remove(id: number): Promise<void> {
        const butaca = await this.butacaRepository.findOne({ where: { id } });
        if (!butaca) throw new NotFoundException(`Butaca con id ${id} no encontrada`);
        await this.butacaRepository.remove(butaca);
    }

    // 🔹 Mapper de Entity -> DTO Response
    private toResponse(entity: Butaca): ButacaResponse {
        return {
            id: entity.id,
            nroButaca: entity.nroButaca,
            fila: {
                letraFila: entity.fila?.letraFila ?? '',
            },
            estadoDisponibilidad: {
                nombre: entity.disponibilidadButaca?.estadoDisponibilidadButaca?.nombre ?? '',
            },
        };
    }

    async getButacaById(id: number): Promise<Butaca> {
        const butaca = await this.butacaRepository.findOne({ where: { id } });
        if (!butaca) {
            throw new NotFoundException(`Butaca con id ${id} no encontrada`);
        }
        return butaca;
    }
}