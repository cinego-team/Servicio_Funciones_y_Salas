import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FormatoService } from './formato.service';
import { FormatoInput, FormatoResponse } from './dto';

@Controller('formato')
export class FormatoController {
    constructor(private readonly formatoService: FormatoService) { }

    // Crear un formato
    @Post()
    async create(@Body() body: FormatoInput): Promise<FormatoResponse> {
        return this.formatoService.create(body);
    }

    // Listar todos los formatos
    @Get()
    async findAll(): Promise<FormatoResponse[]> {
        return this.formatoService.findAll();
    }

    // Obtener un formato por id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<FormatoResponse> {
        return this.formatoService.findOne(id);
    }

    // Actualizar un formato
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: FormatoInput
    ): Promise<FormatoResponse> {
        return this.formatoService.update(id, body);
    }

    // Eliminar un formato
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.formatoService.remove(id);
    }
}
