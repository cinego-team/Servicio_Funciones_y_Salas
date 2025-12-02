import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FuncionService } from './funcion.service';
import { FuncionButacasDetalleResponse, FuncionInput } from './dto';
import { FuncionResponse } from './dto';

@Controller('funciones')
export class FuncionController {
    constructor(private readonly funcionService: FuncionService) { }

    @Post()
    async createFuncion(@Body() datos: FuncionInput): Promise<FuncionResponse> {
        return this.funcionService.newFuncion(datos);
    }

    @Get(':id')
    async getFuncion(@Param('id', ParseIntPipe) id: number): Promise<FuncionResponse> {
        return this.funcionService.getFuncionById(id);
    }

    @Get('pelicula/:peliculaId')
    async getFuncionesByPeliculaId(@Param('peliculaId', ParseIntPipe) peliculaId: number): Promise<FuncionResponse[]> {
        return this.funcionService.getFuncionesByPeliculaId(peliculaId);
    }

    @Put(':id')
    async updateFuncion(@Param('id', ParseIntPipe) id: number, @Body() datos: FuncionInput): Promise<FuncionResponse> {
        return this.funcionService.updateFuncion(id, datos);
    }

    @Delete(':id')
    async deleteFuncion(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.funcionService.deleteFuncionById(id);
    }

    @Get(':id/butacas-detalle')
    async getFuncionWithButacasDetails(@Param('id', ParseIntPipe) id: number): Promise<FuncionButacasDetalleResponse> {
        return this.funcionService.getFuncionWithButacasDetails(id);
    }
}