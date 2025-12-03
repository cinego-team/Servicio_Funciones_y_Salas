import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { EstadoDisponibilidadButacaService } from './estado-disponibilidad-butaca.service';
import { EstadoDisponibilidadInput, EstadoDisponibilidadResponse } from './dto';

@Controller('estado-disponibilidad-butaca')
export class EstadoDisponibilidadButacaController {
    constructor(private readonly estadoService: EstadoDisponibilidadButacaService) { }

    @Post()
    async create(@Body() body: EstadoDisponibilidadInput): Promise<EstadoDisponibilidadResponse> {
        return this.estadoService.create(body);
    }

    @Get()
    async findAll(): Promise<EstadoDisponibilidadResponse[]> {
        return this.estadoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<EstadoDisponibilidadResponse> {
        return this.estadoService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EstadoDisponibilidadInput
    ): Promise<EstadoDisponibilidadResponse> {
        return this.estadoService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.estadoService.remove(id);
    }
}
