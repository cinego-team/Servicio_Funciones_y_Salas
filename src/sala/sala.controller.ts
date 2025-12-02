import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SalaService } from './sala.service';
import { SalaInput, SalaResponse } from './dto';

@Controller('salas')
export class SalaController {
    constructor(private readonly salaService: SalaService) { }

    // 1. Crear Sala
    @Post()
    async create(@Body() data: SalaInput): Promise<SalaResponse> {
        return this.salaService.create(data);
    }

    // 2. Listar todas las Salas
    @Get()
    async findAll(): Promise<SalaResponse[]> {
        return this.salaService.findAll();
    }

    // 3. Obtener una Sala por id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SalaResponse> {
        return this.salaService.findOne(id);
    }

    // 4. Actualizar Sala
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: Partial<SalaInput>,
    ): Promise<SalaResponse> {
        return this.salaService.update(id, data);
    }

    // 5. Eliminar Sala
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.salaService.remove(id);
    }
}