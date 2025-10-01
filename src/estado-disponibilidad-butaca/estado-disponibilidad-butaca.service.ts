import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoDisponibilidadButaca } from '../entities/estadoDisponibilidadButaca.entity';
import { EstadoDisponibilidadInput, EstadoDisponibilidadResponse } from './dto';

@Injectable()
export class EstadoDisponibilidadService {
  constructor(
    @InjectRepository(EstadoDisponibilidadButaca)
    private readonly estadoRepo: Repository<EstadoDisponibilidadButaca>,
  ) {}

  // 🟢 CREATE
  async create(input: EstadoDisponibilidadInput): Promise<EstadoDisponibilidadResponse> {
    const estado = this.estadoRepo.create({ nombre: input.nombre });
    const saved = await this.estadoRepo.save(estado);
    return this.toResponse(saved);
  }

  // 🟢 FIND ALL
  async findAll(): Promise<EstadoDisponibilidadResponse[]> {
    const estados = await this.estadoRepo.find();
    return estados.map((e) => this.toResponse(e));
  }

  // 🟢 FIND ONE
  async findOne(id: number): Promise<EstadoDisponibilidadResponse> {
    const estado = await this.estadoRepo.findOne({ where: { id } });
    if (!estado) throw new NotFoundException(`Estado con id ${id} no encontrado`);
    return this.toResponse(estado);
  }

  // 🟢 UPDATE
  async update(id: number, input: EstadoDisponibilidadInput): Promise<EstadoDisponibilidadResponse> {
    const estado = await this.estadoRepo.findOne({ where: { id } });
    if (!estado) throw new NotFoundException(`Estado con id ${id} no encontrado`);

    estado.nombre = input.nombre;
    const updated = await this.estadoRepo.save(estado);
    return this.toResponse(updated);
  }

  // 🟢 REMOVE
  async remove(id: number): Promise<void> {
    const estado = await this.estadoRepo.findOne({ where: { id } });
    if (!estado) throw new NotFoundException(`Estado con id ${id} no encontrado`);
    await this.estadoRepo.remove(estado);
  }

  // 🔹 Mapper: Entity → DTO Response
  private toResponse(entity: EstadoDisponibilidadButaca): EstadoDisponibilidadResponse {
    return {
      id: entity.id,
      nombre: entity.nombre,
    };
  }
}