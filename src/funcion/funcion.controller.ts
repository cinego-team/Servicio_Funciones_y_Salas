import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FuncionService } from './funcion.service';
import { FuncionInput, FuncionInputUpdate } from './dto';
import { FuncionResponse } from './dto';

@Controller('funciones')
export class FuncionController {
  constructor(private readonly funcionService: FuncionService) {}

  // === Crear una nueva funcion ===
  @Post()
  async createFuncion(@Body() datos: FuncionInput): Promise<FuncionResponse> {
    return this.funcionService.newFuncion(datos);
  }

  // === Obtener funcion por id ===
  @Get(':id')
  async getFuncion(@Param('id', ParseIntPipe) id: number): Promise<FuncionResponse> {
    return this.funcionService.getFuncionById(id);
  }

  // === Actualización completa ===
  @Put(':id')
  async updateFuncion(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: FuncionInputUpdate,
  ): Promise<FuncionResponse> {
    return this.funcionService.updateFuncion(id, datos);
  }

  // === Actualización parcial ===
  @Patch(':id')
  async partialUpdateFuncion(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<FuncionInputUpdate>,
  ): Promise<FuncionResponse> {
    return this.funcionService.partialUpdateFuncion(id, datos);
  }

  // === Eliminar funcion ===
  @Delete(':id')
  async deleteFuncion(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.funcionService.deleteFuncionById(id);
  }
}