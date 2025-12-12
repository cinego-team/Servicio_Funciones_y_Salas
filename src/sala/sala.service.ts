import {
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilaService } from 'src/fila/fila.service';
import { Sala } from '../entities/sala.entity';
import { Fila } from 'src/entities/fila.entity';
import { SalaInput, SalaResponse, SalaResponseForSelec } from './dto';

@Injectable()
export class SalaService {
    constructor(
        @InjectRepository(Sala)
        private readonly salaRepository: Repository<Sala>,
        @Inject(forwardRef(() => FilaService))
        private readonly filaService: FilaService,
    ) {}

    async create(data: SalaInput): Promise<SalaResponse> {
        try {
            const filasACrear: Fila[] = await this.filaService.createMultiple(
                data.cantFilas,
                data.cantButacasPorFila,
            );
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

    async findAll(): Promise<SalaResponse[]> {
        try {
            const salas = await this.salaRepository.find({
                relations: ['filas', 'filas.butacas'],
            });

            if (!salas) {
                throw new NotFoundException('No se encontraron salas');
            }

            return salas.map((sala) => {
                const response: SalaResponse = {
                    id: sala.id,
                    estaDisponible: sala.estaDisponible,
                    nroSala: sala.nroSala,
                    cantFilas: sala.filas.length,
                    cantButacasPorFila:
                        sala.filas.length > 0
                            ? sala.filas[0].butacas.length
                            : 0,
                };
                return response;
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener las salas',
            );
        }
    }

    async findOne(id: number): Promise<SalaResponse> {
        try {
            const sala = await this.salaRepository.findOne({
                where: { id },
                relations: ['filas', 'filas.butacas'],
            });

            if (!sala) {
                throw new NotFoundException(`Sala con id ${id} no encontrada`);
            }

            const response: SalaResponse = {
                id: sala.id,
                estaDisponible: sala.estaDisponible,
                nroSala: sala.nroSala,
                cantFilas: sala.filas.length,
                cantButacasPorFila:
                    sala.filas.length > 0 ? sala.filas[0].butacas.length : 0,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la sala');
        }
    }

    async update(id: number, data: Partial<SalaInput>): Promise<SalaResponse> {
        try {
            const sala = await this.salaRepository.findOne({ where: { id } });
            if (!sala) {
                throw new NotFoundException(`Sala con id ${id} no encontrada`);
            }

            if (data.estaDisponible) {
                sala.estaDisponible = data.estaDisponible;
            }

            if (data.nroSala) {
                sala.nroSala = data.nroSala ?? sala.nroSala;
            }

            if (data.cantFilas && !data.cantButacasPorFila) {
                throw new InternalServerErrorException(
                    'Debe proporcionar cantButacasPorFila al actualizar cantFilas',
                );
            }

            if (!data.cantFilas && data.cantButacasPorFila) {
                const filasACrear: Fila[] =
                    await this.filaService.createMultiple(
                        sala.filas.length,
                        data.cantButacasPorFila,
                    );
                await this.filaService.saveArray(filasACrear);
            }

            if (data.cantFilas && data.cantButacasPorFila) {
                const filasACrear: Fila[] =
                    await this.filaService.createMultiple(
                        data.cantFilas,
                        data.cantButacasPorFila,
                    );
                await this.filaService.saveArray(filasACrear);

                sala.filas = filasACrear;
            }

            await this.salaRepository.save(sala);

            const response: SalaResponse = {
                id: sala.id,
                estaDisponible: sala.estaDisponible,
                nroSala: sala.nroSala,
                cantFilas: sala.filas.length,
                cantButacasPorFila:
                    sala.filas.length > 0 ? sala.filas[0].butacas.length : 0,
            };

            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al actualizar la sala',
            );
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.salaRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Sala con id ${id} no encontrada`);
            }
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la sala');
        }
    }

    async getSalaById(id: number): Promise<Sala> {
        try {
            const sala = await this.salaRepository.findOne({ where: { id } });
            if (!sala) {
                throw new NotFoundException(`Sala con id ${id} no encontrada`);
            }
            return sala;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la sala');
        }
    }

    async getButacasIdBySalaId(salaId: number): Promise<number[]> {
        try {
            const sala = await this.salaRepository.findOne({
                where: { id: salaId },
                relations: ['filas', 'filas.butacas'],
            });
            if (!sala) {
                throw new NotFoundException(
                    `Sala con id ${salaId} no encontrada`,
                );
            }
            if (!sala.filas || sala.filas.length === 0) {
                throw new NotFoundException(
                    `No se encontraron filas para la sala con id ${salaId}`,
                );
            }
            let butacasId: number[] = [];
            sala.filas.forEach((fila) => {
                if (fila.butacas && fila.butacas.length > 0) {
                    fila.butacas.forEach((butaca) => {
                        butacasId.push(butaca.id);
                    });
                } else {
                    throw new NotFoundException(
                        `No se encontraron butacas para la fila con id ${fila.id}`,
                    );
                }
            });
            return butacasId;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener las butacas de la sala',
            );
        }
    }
    async getSalasForSelec(): Promise<SalaResponseForSelec[]> {
        const salas = await this.salaRepository.find({
            select: ['id', 'nroSala'],
        });

        if (salas.length === 0) {
            throw new NotFoundException('No se encontraron salas');
        }

        return salas.map((sala) => ({
            id: sala.id,
            nroSala: sala.nroSala,
        }));
    }
    async getAllSalas(): Promise<SalaResponse[]> {
        try {
            // Cargamos todo lo necesario: filas y butacas
            const salas = await this.salaRepository.find({
                relations: ['filas', 'filas.butacas'],
            });

            return salas.map((sala) => {
                const cantFilas = sala.filas.length;

                // Si la sala tiene filas, la cantidad de butacas por fila se toma de la primera
                const cantButacasPorFila =
                    cantFilas > 0 ? sala.filas[0].butacas.length : 0;

                // La capacidad total es la suma de todas las butacas
                const capacidad = sala.filas.reduce(
                    (total, fila) => total + fila.butacas.length,
                    0,
                );

                return {
                    id: sala.id,
                    nroSala: sala.nroSala,
                    estaDisponible: sala.estaDisponible,
                    cantFilas: cantFilas,
                    cantButacasPorFila: cantButacasPorFila,
                    capacidad: capacidad,
                };
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener las salas',
            );
        }
    }
}
