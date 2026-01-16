import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Idioma } from '../entities/idioma.entity';
import { IdiomaInput, IdiomaResponse } from './dto';

@Injectable()
export class IdiomaService {
    constructor(
        @InjectRepository(Idioma)
        private readonly idiomaRepo: Repository<Idioma>,
    ) {}
    private toResponse(i: Idioma): IdiomaResponse {
        return {
            id: i.id,
            nombre: i.nombre,
        };
    }

    async newIdioma(datos: IdiomaInput): Promise<IdiomaResponse> {
        const idioma = this.idiomaRepo.create({ nombre: datos.nombre });
        await this.idiomaRepo.save(idioma);
        return this.toResponse(idioma);
    }

    async getAllIdiomas(page = 1, quantity = 10): Promise<IdiomaResponse[]> {
        const skip = (page - 1) * quantity;
        const list = await this.idiomaRepo.find({
            order: { nombre: 'ASC' },
            skip,
            take: quantity,
        });
        return list.map((i) => this.toResponse(i));
    }

    async getIdiomaById(id: number): Promise<IdiomaResponse> {
        const idioma = await this.idiomaRepo.findOne({
            where: { id: id },
        });
        if (!idioma) throw new Error('404 Idioma not found.');
        return this.toResponse(idioma);
    }

    async updateIdioma(
        id: number,
        datos: IdiomaInput,
    ): Promise<IdiomaResponse> {
        const idioma = await this.idiomaRepo.findOne({
            where: { id: id },
        });
        if (!idioma) throw new Error('404 Idioma not found.');
        idioma.nombre = datos.nombre;
        await this.idiomaRepo.save(idioma);
        return this.toResponse(idioma);
    }
    async partialUpdateIdioma(
        id: number,
        datos: Partial<IdiomaInput>,
    ): Promise<IdiomaResponse> {
        const idioma = await this.idiomaRepo.findOne({
            where: { id: id },
        });
        if (!idioma) throw new Error('404 Idioma not found.');

        if (datos.nombre !== undefined) idioma.nombre = datos.nombre;

        await this.idiomaRepo.save(idioma);
        return this.toResponse(idioma);
    }
    async deleteIdiomaById(id: number): Promise<{ message: string }> {
        const idioma = await this.idiomaRepo.findOne({
            where: { id },
        });

        if (!idioma) {
            throw new NotFoundException('Idioma no encontrado');
        }

        await this.idiomaRepo.remove(idioma);

        return { message: 'Deleted' };
    }

    async getIdiomaByIdForPut(id: number): Promise<Idioma> {
        const idioma = await this.idiomaRepo.findOne({ where: { id } });

        if (!idioma) {
            throw new NotFoundException('Idioma no existe');
        }

        return idioma;
    }
}
