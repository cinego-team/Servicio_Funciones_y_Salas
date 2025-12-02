import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from '../entities/sala.entity';
import { SalaInput, SalaResponse } from './dto';
import { FilaService } from 'src/fila/fila.service';
import { Fila } from 'src/entities/fila.entity';

@Injectable()
export class SalaService {
    constructor(
        @InjectRepository(Sala)
        private readonly salaRepository: Repository<Sala>,
        private readonly filaService: FilaService,
    ) { }

    async create(data: SalaInput): Promise<SalaResponse> {
        try {
            const filasACrear: Fila[] = await this.filaService.createMultiple(data.cantFilas, data.cantButacasPorFila);
            await this.filaService.saveArray(filasACrear);

            const sala = this.salaRepository.create({
                estaDisponible: data.estaDisponible,
                nroSala: data.nroSala,
                filas: filasACrear,
            });

            await this.salaRepository.save(sala);

            const response: SalaResponse = {
                id: sala.id,
                estaDisponible: sala.estaDisponible,
                nroSala: sala.nroSala,
                cantFilas: data.cantFilas,
                cantButacasPorFila: data.cantButacasPorFila,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la sala');
        }
    }

    // 2. Listar todas las Salas
    async findAll(): Promise<SalaResponse[]> {
        const salas = await this.salaRepository.find({
            relations: ['funciones', 'filas'],
        });

        return salas.map((sala) => {
            const response: SalaResponse = {
                id: sala.id,
                estaDisponible: sala.estaDisponible,
                nroSala: sala.nroSala,
            };
            return response;
        });
    }

    // 3. Buscar una Sala por id
    async findOne(id: number): Promise<SalaResponse> {
        const sala = await this.salaRepository.findOne({
            where: { id },
            relations: ['funciones', 'filas'],
        });
        if (!sala) {
            throw new NotFoundException(`Sala con id ${id} no encontrada`);
        }

        const response: SalaResponse = {
            id: sala.id,
            estaDisponible: sala.estaDisponible,
            nroSala: sala.nroSala,
        };
        return response;
    }

    // 4. Actualizar Sala
    async update(id: number, data: Partial<SalaInput>): Promise<SalaResponse> {
        const sala = await this.salaRepository.findOne({ where: { id } });
        if (!sala) {
            throw new NotFoundException(`Sala con id ${id} no encontrada`);
        }

        sala.estaDisponible = data.estaDisponible ?? sala.estaDisponible;
        sala.nroSala = data.nroSala ?? sala.nroSala;

        await this.salaRepository.save(sala);

        const response: SalaResponse = {
            id: sala.id,
            estaDisponible: sala.estaDisponible,
            nroSala: sala.nroSala,
        };
        return response;
    }

    // 5. Eliminar Sala
    async remove(id: number): Promise<void> {
        const result = await this.salaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Sala con id ${id} no encontrada`);
        }
    }

    async getSalaById(id: number): Promise<Sala> {
        const sala = await this.salaRepository.findOne({ where: { id } });
        if (!sala) {
            throw new NotFoundException(`Sala con id ${id} no encontrada`);
        }
        return sala;
    }

    async getButacasIdBySalaId(salaId: number): Promise<number[]> {
        const sala = await this.salaRepository.findOne({
            where: { id: salaId },
            relations: ['filas', 'filas.butacas'],
        });
        if (!sala) {
            throw new NotFoundException(`Sala con id ${salaId} no encontrada`);
        }
        if (!sala.filas || sala.filas.length === 0) {
            throw new NotFoundException(`No se encontraron filas para la sala con id ${salaId}`);
        }
        let butacasId: number[] = [];
        sala.filas.forEach(fila => {
            if (fila.butacas && fila.butacas.length > 0) {
                fila.butacas.forEach(butaca => {
                    butacasId.push(butaca.id);
                });
            } else {
                throw new NotFoundException(`No se encontraron butacas para la fila con id ${fila.id}`);
            }
        });
        return butacasId;
    }
}