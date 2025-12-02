// fila.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FilaService } from './fila.service';
import { FilaInput, FilaResponse } from './dto';

@Controller('fila')
export class FilaController {
    constructor(private readonly filaService: FilaService) { }

    // Crear una fila
    @Post()
    async create(@Body() body: FilaInput): Promise<FilaResponse> {
        return this.filaService.create(body);
    }

    // Listar todas las filas
    @Get()
    async findAll(): Promise<FilaResponse[]> {
        return this.filaService.findAll();
    }

    // Obtener una fila por id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<FilaResponse> {
        return this.filaService.findOne(id);
    }

    // Actualizar una fila
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: FilaInput
    ): Promise<FilaResponse> {
        return this.filaService.update(id, body);
    }

    // Eliminar una fila
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.filaService.remove(id);
    }
}
