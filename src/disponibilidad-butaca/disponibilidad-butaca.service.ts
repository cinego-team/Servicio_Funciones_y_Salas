
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisponibilidadButaca } from '../entities/disponibilidadButaca.entity';
import { Funcion } from '../entities/funcion.entity';
import { Butaca } from '../entities/butaca.entity';
import { EstadoDisponibilidadButaca, EstadoButacaEnum } from '../entities/estadoDisponibilidadButaca.entity';
import { DisponibilidadButacaResponse } from './dto';

@Injectable()
export class DisponibilidadButacaService {
    constructor(
        @InjectRepository(DisponibilidadButaca)
        private readonly disponibilidadRepo: Repository<DisponibilidadButaca>,
        @InjectRepository(Funcion)
        private readonly funcionRepo: Repository<Funcion>,
        @InjectRepository(Butaca)
        private readonly butacaRepo: Repository<Butaca>,
        @InjectRepository(EstadoDisponibilidadButaca)
        private readonly estadoRepo: Repository<EstadoDisponibilidadButaca>,
    ) { }

    // Crear disponibilidad
    async create(data: {
        funcionId: number;
        butacaId: number;
        estadoDisponibilidadButacaId: EstadoButacaEnum;
    }): Promise<DisponibilidadButacaResponse> {
        const funcion = await this.funcionRepo.findOne({ where: { id: data.funcionId } });
        const butaca = await this.butacaRepo.findOne({ where: { id: data.butacaId } });
        const estado = await this.estadoRepo.findOne({ where: { id: Number(data.estadoDisponibilidadButacaId) } });

        if (!funcion || !butaca || !estado) {
            throw new NotFoundException('Funcion, Butaca o Estado no encontrado');
        }

        const disponibilidad = this.disponibilidadRepo.create({
            funcion,
            butaca,
            estadoDisponibilidadButaca: estado,
        });

        const saved = await this.disponibilidadRepo.save(disponibilidad);

        return {
            id: saved.id,
            funcionId: saved.funcion.id,
            butacaId: saved.butaca.id,
            estadoDisponibilidadButacaId: saved.estadoDisponibilidadButaca.nombre as EstadoButacaEnum,
        };
    }

    // Obtener todas las disponibilidades
    async findAll(): Promise<DisponibilidadButacaResponse[]> {
        const disponibilidades = await this.disponibilidadRepo.find({ relations: ['funcion', 'butaca', 'estadoDisponibilidadButaca'] });

        return disponibilidades.map(d => ({
            id: d.id,
            funcionId: d.funcion.id,
            butacaId: d.butaca.id,
            estadoDisponibilidadButacaId: d.estadoDisponibilidadButaca.nombre as EstadoButacaEnum,
        }));
    }

    // Obtener por ID
    async findOne(id: number): Promise<DisponibilidadButacaResponse> {
        const d = await this.disponibilidadRepo.findOne({ where: { id }, relations: ['funcion', 'butaca', 'estadoDisponibilidadButaca'] });
        if (!d) throw new NotFoundException('Disponibilidad no encontrada');

        return {
            id: d.id,
            funcionId: d.funcion.id,
            butacaId: d.butaca.id,
            estadoDisponibilidadButacaId: d.estadoDisponibilidadButaca.nombre as EstadoButacaEnum,
        };
    }

    // Actualizar
    async update(id: number, data: {
        funcionId?: number;
        butacaId?: number;
        estadoDisponibilidadButacaId?: EstadoButacaEnum;
    }): Promise<DisponibilidadButacaResponse> {
        const disponibilidad = await this.disponibilidadRepo.findOne({ where: { id }, relations: ['funcion', 'butaca', 'estadoDisponibilidadButaca'] });
        if (!disponibilidad) throw new NotFoundException('Disponibilidad no encontrada');

        if (data.funcionId) {
            const funcion = await this.funcionRepo.findOne({ where: { id: data.funcionId } });
            if (!funcion) throw new NotFoundException('Funcion no encontrada');
            disponibilidad.funcion = funcion;
        }

        if (data.butacaId) {
            const butaca = await this.butacaRepo.findOne({ where: { id: data.butacaId } });
            if (!butaca) throw new NotFoundException('Butaca no encontrada');
            disponibilidad.butaca = butaca;
        }

        if (data.estadoDisponibilidadButacaId) {
            const estado = await this.estadoRepo.findOne({ where: { id: Number(data.estadoDisponibilidadButacaId) } });
            if (!estado) throw new NotFoundException('Estado no encontrado');
            disponibilidad.estadoDisponibilidadButaca = estado;
        }

        const saved = await this.disponibilidadRepo.save(disponibilidad);

        return {
            id: saved.id,
            funcionId: saved.funcion.id,
            butacaId: saved.butaca.id,
            estadoDisponibilidadButacaId: saved.estadoDisponibilidadButaca.nombre as EstadoButacaEnum,
        };
    }

    // Reservar butacas (cambiar estado a RESERVADA)
    async reservarButacas(disponibilidadButacaIds: number[]): Promise<{ actualizadas: number; mensaje: string }> {
        // Buscar el estado RESERVADA
        const estadoReservada = await this.estadoRepo.findOne({
            where: { nombre: EstadoButacaEnum.RESERVADA }
        });

        if (!estadoReservada) {
            throw new NotFoundException('Estado RESERVADA no encontrado en la base de datos');
        }

        // Actualizar todas las disponibilidades de butaca
        let actualizadas = 0;
        for (const id of disponibilidadButacaIds) {
            const disponibilidad = await this.disponibilidadRepo.findOne({
                where: { id },
                relations: ['estadoDisponibilidadButaca']
            });

            if (disponibilidad) {
                disponibilidad.estadoDisponibilidadButaca = estadoReservada;
                await this.disponibilidadRepo.save(disponibilidad);
                actualizadas++;
            }
        }

        return {
            actualizadas,
            mensaje: `${actualizadas} butacas reservadas exitosamente`,
        };
    }

    // Ocupar butacas (cambiar estado a OCUPADO)
    async ocuparButacas(disponibilidadButacaIds: number[]): Promise<{ actualizadas: number; mensaje: string }> {
        // Buscar el estado OCUPADO
        const estadoOcupado = await this.estadoRepo.findOne({
            where: { nombre: EstadoButacaEnum.OCUPADA }
        });

        if (!estadoOcupado) {
            throw new NotFoundException('Estado OCUPADO no encontrado en la base de datos');
        }

        // Actualizar todas las disponibilidades de butaca
        let actualizadas = 0;
        for (const id of disponibilidadButacaIds) {
            const disponibilidad = await this.disponibilidadRepo.findOne({
                where: { id },
                relations: ['estadoDisponibilidadButaca']
            });

            if (disponibilidad) {
                disponibilidad.estadoDisponibilidadButaca = estadoOcupado;
                await this.disponibilidadRepo.save(disponibilidad);
                actualizadas++;
            }
        }

        return {
            actualizadas,
            mensaje: `${actualizadas} butacas ocupadas exitosamente`,
        };
    }

    // Eliminar
    async remove(id: number): Promise<void> {
        const result = await this.disponibilidadRepo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Disponibilidad no encontrada');
    }

    createDisponibilidadButaca(data: {
        funcion: Funcion;
        butaca: Butaca;
        estadoDisponibilidadButaca: EstadoDisponibilidadButaca;
    }): DisponibilidadButaca {
        try {
            return this.disponibilidadRepo.create({
                funcion: data.funcion,
                butaca: data.butaca,
                estadoDisponibilidadButaca: data.estadoDisponibilidadButaca,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la disponibilidad de butaca');
        }
    }

    async saveArray(disponibilidades: DisponibilidadButaca[]): Promise<DisponibilidadButaca[]> {
        try {
            return await this.disponibilidadRepo.save(disponibilidades);
        } catch (error) {
            throw new InternalServerErrorException('Error al guardar las disponibilidades de butaca');
        }
    }
}