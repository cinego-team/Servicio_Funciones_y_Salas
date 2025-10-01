import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from '../entities/sala.entity';
import { SalaInput, SalaResponse } from './dto';

@Injectable()
export class SalaService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  // 1. Crear Sala
  async create(data: SalaInput): Promise<SalaResponse> {
    const sala = this.salaRepository.create({
      capacidad: data.capacidad,
      estaDisponible: data.estaDisponible,
      nroSala: data.nroSala,
    });

    await this.salaRepository.save(sala);

    const response: SalaResponse = {
      id: sala.id,
      capacidad: sala.capacidad,
      estaDisponible: sala.estaDisponible,
      nroSala: sala.nroSala,
    };
    return response;
  }

  // 2. Listar todas las Salas
  async findAll(): Promise<SalaResponse[]> {
    const salas = await this.salaRepository.find({
      relations: ['funciones', 'filas'],
    });

    return salas.map((sala) => {
      const response: SalaResponse = {
        id: sala.id,
        capacidad: sala.capacidad,
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
      capacidad: sala.capacidad,
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

    sala.capacidad = data.capacidad ?? sala.capacidad;
    sala.estaDisponible = data.estaDisponible ?? sala.estaDisponible;
    sala.nroSala = data.nroSala ?? sala.nroSala;

    await this.salaRepository.save(sala);

    const response: SalaResponse = {
      id: sala.id,
      capacidad: sala.capacidad,
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
}