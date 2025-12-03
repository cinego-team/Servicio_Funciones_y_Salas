import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Patch } from '@nestjs/common';
import { DisponibilidadButacaService } from './disponibilidad-butaca.service';
import { DisponibilidadButacaInput, DisponibilidadButacaResponse } from './dto';

@Controller('disponibilidad-butaca')
export class DisponibilidadButacaController {
    constructor(private readonly disponibilidadService: DisponibilidadButacaService) { }

    @Get()
    async findAll(): Promise<DisponibilidadButacaResponse[]> {
        return this.disponibilidadService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<DisponibilidadButacaResponse> {
        return this.disponibilidadService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<DisponibilidadButacaInput>
    ): Promise<DisponibilidadButacaResponse> {
        return this.disponibilidadService.update(id, body);
    }

    @Patch('reservar')
    async reservarButacas(
        @Body() body: { disponibilidadButacaIds: number[] }
    ): Promise<{ actualizadas: number }> {
        return this.disponibilidadService.reservarButacas(body.disponibilidadButacaIds);
    }

    @Patch('ocupar')
    async ocuparButacas(
        @Body() body: { disponibilidadButacaIds: number[] }
    ): Promise<{ actualizadas: number }> {
        return this.disponibilidadService.ocuparButacas(body.disponibilidadButacaIds);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.disponibilidadService.remove(id);
    }
}
