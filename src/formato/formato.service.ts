import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formato } from '../entities/formato.entity';
import { FormatoInput, FormatoResponse, FormatoResponseAdmin } from './dto';

@Injectable()
export class FormatoService {
    constructor(
        @InjectRepository(Formato)
        private readonly formatoRepository: Repository<Formato>,
    ) {}

    async create(formatoData: FormatoInput): Promise<FormatoResponse> {
        try {
            const formato = this.formatoRepository.create({
                nombre: formatoData.nombre,
                precio: formatoData.precio,
            });
            await this.formatoRepository.save(formato);

            const response: FormatoResponse = {
                id: formato.id,
                nombre: formato.nombre,
                precio: formato.precio,
            };
            return response;
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el formato');
        }
    }

    async findAll(): Promise<FormatoResponse[]> {
        try {
            const formatos = await this.formatoRepository.find({
                relations: ['funciones'],
            });

            if (!formatos || formatos.length === 0) {
                throw new NotFoundException('No se encontraron formatos');
            }

            const response: FormatoResponse[] = formatos.map((formato) => {
                return {
                    id: formato.id,
                    nombre: formato.nombre,
                    precio: formato.precio,
                    funciones: formato.funciones,
                };
            });
            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener los formatos',
            );
        }
    }

    async findOne(id: number): Promise<FormatoResponse> {
        try {
            const formato = await this.formatoRepository.findOne({
                where: { id },
                relations: ['funciones'],
            });

            if (!formato) {
                throw new NotFoundException(
                    `Formato con id ${id} no encontrado`,
                );
            }

            const response: FormatoResponse = {
                id: formato.id,
                nombre: formato.nombre,
                precio: formato.precio,
                funciones: formato.funciones,
            };

            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener el formato',
            );
        }
    }

    async update(
        id: number,
        updateData: Partial<FormatoInput>,
    ): Promise<FormatoResponseAdmin> {
        try {
            const formato = await this.findOne(id);

            if (!formato) {
                throw new NotFoundException(
                    `Formato con id ${id} no encontrado`,
                );
            }

            if (updateData.nombre) {
                formato.nombre = updateData.nombre;
            }

            if (updateData.precio) {
                formato.precio = updateData.precio;
            }

            await this.formatoRepository.save(formato);

            const response: FormatoResponseAdmin = {
                id: formato.id,
                nombre: formato.nombre,
                precio: formato.precio,
            };

            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al actualizar el formato',
            );
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.formatoRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(
                    `Formato con id ${id} no encontrado`,
                );
            }
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al eliminar el formato',
            );
        }
    }

    async getFormatoById(id: number): Promise<Formato> {
        try {
            const formato = await this.formatoRepository.findOne({
                where: { id },
            });
            if (!formato) {
                throw new NotFoundException(
                    `Formato con id ${id} no encontrado`,
                );
            }
            return formato;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener el formato por ID',
            );
        }
    }
    async findAllAdmin(): Promise<FormatoResponseAdmin[]> {
        try {
            const formatos = await this.formatoRepository.find({
                relations: ['funciones'],
            });
            if (!formatos || formatos.length === 0) {
                throw new NotFoundException('No se encontraron formatos');
            }

            const response: FormatoResponseAdmin[] = formatos.map((formato) => {
                return {
                    id: formato.id,
                    nombre: formato.nombre,
                    precio: formato.precio,
                };
            });
            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener los formatos',
            );
        }
    }
    async findOneAdmin(id: number): Promise<FormatoResponseAdmin> {
        try {
            const formato = await this.formatoRepository.findOne({
                where: { id },
                relations: ['funciones'],
            });

            if (!formato) {
                throw new NotFoundException(
                    `Formato con id ${id} no encontrado`,
                );
            }

            const response: FormatoResponseAdmin = {
                id: formato.id,
                nombre: formato.nombre,
                precio: formato.precio,
            };

            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener el formato',
            );
        }
    }
}
