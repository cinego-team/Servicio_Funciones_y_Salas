import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import { FuncionService } from './funcion.service';
import { ButacasDetalleResponse, FuncionInput } from './dto';
import {
    FuncionResponse,
    FuncionResponseAdmin,
    FuncionInputAdmin,
} from './dto';

@Controller('funcion')
export class FuncionController {
    constructor(private readonly funcionService: FuncionService) {}

    @Post()
    async createFuncion(@Body() datos: FuncionInput): Promise<FuncionResponse> {
        return this.funcionService.newFuncion(datos);
    }

    @Get(':id')
    async getFuncion(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<FuncionResponse> {
        return this.funcionService.findOne(id);
    }

    @Get('funciones-por-pelicula/:peliculaId')
    async getFuncionesByPeliculaId(
        @Param('peliculaId', ParseIntPipe) peliculaId: number,
    ): Promise<FuncionResponseAdmin[]> {
        return this.funcionService.getFuncionesByPeliculaId(peliculaId);
    }

    @Put(':id')
    async updateFuncion(
        @Param('id', ParseIntPipe) id: number,
        @Body() datos: Partial<FuncionInput>,
    ): Promise<FuncionResponse> {
        return this.funcionService.updateFuncion(id, datos);
    }

    @Get(':id/butacas-detalle')
    async getButacasDetails(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ButacasDetalleResponse> {
        return this.funcionService.getButacasDetails(id);
    }
    @Get('admin/all')
    async getAllFuncionesAdmin(): Promise<FuncionResponseAdmin[]> {
        return this.funcionService.getFunciones();
    }
    @Get('admin/:id')
    async getFuncionAdmin(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<FuncionResponseAdmin> {
        return this.funcionService.getFuncById(id);
    }
    @Post('admin/new')
    async createFuncionAdmin(
        @Body() datos: FuncionInputAdmin,
    ): Promise<FuncionResponseAdmin> {
        return this.funcionService.createFuncionAdmin(datos);
    }
    @Delete('admin/:id')
    async deleteFuncion(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.funcionService.deleteFuncionById(id);
    }
    @Put('admin/:id')
    async updateFuncionAdmin(
        @Param('id', ParseIntPipe) id: number,
        @Body() datos: Partial<FuncionInputAdmin>,
    ): Promise<FuncionResponseAdmin> {
        return this.funcionService.updateFuncionAdmin(id, datos);
    }
}
