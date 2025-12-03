import { Controller, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FilaService } from './fila.service';
import { FilaInput, FilaResponse } from './dto';

@Controller('fila')
export class FilaController {
    constructor(private readonly filaService: FilaService) { }

    @Get()
    async findAll(): Promise<FilaResponse[]> {
        return this.filaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<FilaResponse> {
        return this.filaService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<FilaInput>
    ): Promise<FilaResponse> {
        return this.filaService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.filaService.remove(id);
    }
}
