// disponibilidad-butaca.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { DisponibilidadButacaService } from './disponibilidad-butaca.service';
import { DisponibilidadButacaResponse } from './dto';
import { EstadoButacaEnum } from '../entities/estadoDisponibilidadButaca.entity';

@Controller('disponibilidad-butaca')
export class DisponibilidadButacaController {
  constructor(private readonly disponibilidadService: DisponibilidadButacaService) {}

  // Crear disponibilidad
  @Post()
  async create(@Body() body: { funcionId: number; butacaId: number; estadoDisponibilidadButacaId: EstadoButacaEnum }): Promise<DisponibilidadButacaResponse> {
    return this.disponibilidadService.create(body);
  }

  // Listar todas las disponibilidades
  @Get()
  async findAll(): Promise<DisponibilidadButacaResponse[]> {
    return this.disponibilidadService.findAll();
  }

  // Obtener una disponibilidad por id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<DisponibilidadButacaResponse> {
    return this.disponibilidadService.findOne(id);
  }

  // Actualizar una disponibilidad
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { funcionId?: number; butacaId?: number; estadoDisponibilidadButacaId?: EstadoButacaEnum }
  ): Promise<DisponibilidadButacaResponse> {
    return this.disponibilidadService.update(id, body);
  }

  // Eliminar una disponibilidad
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.disponibilidadService.remove(id);
  }
}
