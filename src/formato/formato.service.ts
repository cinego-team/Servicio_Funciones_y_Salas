import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formato } from '../entities/formato.entity';
import { FormatoModule } from './formato.module';
import { FormatoInput, FormatoResponse } from './dto';
import { FormDataVisitorHelpers } from 'axios';

@Injectable()
export class FormatoService {
    constructor(
        @InjectRepository(Formato)
        private readonly formatoRepository: Repository<Formato>,
    ) { }

    async create(formatoData: FormatoInput): Promise<FormatoResponse> {
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
        return response
    }

    // 2. Listar todos los formatos
    async findAll(): Promise<Formato[]> {
        return await this.formatoRepository.find({ relations: ['funciones'] });
    }

    // 3. Obtener un formato por id
    async findOne(id: number): Promise<FormatoResponse> {
        const formato = await this.formatoRepository.findOne({
            where: { id },
            relations: ['funciones'],
        });
        if (!formato) {
            throw new NotFoundException(`Formato con id ${id} no encontrado`);
        }
        return {
            id: formato.id,
            nombre: formato.nombre,
            precio: formato.precio,
        };
    }

    // 4. Actualizar un formato
    async update(id: number, updateData: FormatoInput): Promise<FormatoResponse> {
        const formato = await this.findOne(id);
        Object.assign(formato, updateData);
        await this.formatoRepository.save(formato);
        const response: FormatoResponse = {
            id: formato.id,
            nombre: formato.nombre,
            precio: formato.precio,
        };
        return response
    }

    // 5. Eliminar un formato
    async remove(id: number): Promise<void> {
        const resultado = await this.formatoRepository.delete(id);
        if (resultado.affected === 0) {
            throw new NotFoundException(`Formato con id ${id} no encontrado`);
        }
    }

    async getFormatoById(id: number): Promise<Formato> {
        const formato = await this.formatoRepository.findOne({ where: { id } });
        if (!formato) {
            throw new NotFoundException(`Formato con id ${id} no encontrado`);
        }
        return formato;
    }
}