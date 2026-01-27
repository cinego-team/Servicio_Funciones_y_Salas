import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    Headers,
} from '@nestjs/common';
import { FuncionService } from './funcion.service';
import { ButacasDetalleResponse, FuncionInput } from './dto';
import {
    FuncionResponse,
    FuncionResponseAdmin,
    FuncionInputAdmin,
} from './dto';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
@Controller('funcion')
export class FuncionController {
    constructor(private readonly funcionService: FuncionService) {}

    // ===== ADMIN PRIMERO =====
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
    createFuncionAdmin(
        @Body() dto: FuncionInputAdmin,
        @Headers('x-user-id') userId: string,
    ) {
        if (!userId) {
            throw new UnauthorizedException('Usuario no autenticado');
        }

        return this.funcionService.createFuncionAdmin(dto, Number(userId));
    }
    @Put('admin/edit/:id')
    updateFuncionAdmin(
        @Param('id') id: string,
        @Body() dto: Partial<FuncionInputAdmin>,
    ) {
        return this.funcionService.updateFuncionAdmin(Number(id), dto);
    }

    @Delete('admin/:id')
    async deleteFuncion(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.funcionService.deleteFuncionById(id);
    }

    // ===== RUTAS GENERALES DESPUÉS =====
    /**
    @Post()
    async createFuncion(@Body() datos: FuncionInput): Promise<FuncionResponse> {
        return this.funcionService.newFuncion(datos);
    }
         */

    @Get('funciones-por-pelicula/:peliculaId')
    async getFuncionesByPeliculaId(
        @Param('peliculaId', ParseIntPipe) peliculaId: number,
    ): Promise<FuncionResponseAdmin[]> {
        return this.funcionService.getFuncionesByPeliculaId(peliculaId);
    }
    /** 
    @Get(':id')
    async getFuncion(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<FuncionResponse> {
        return this.funcionService.findOne(id);
    }
   
    @Put(':id')
    async updateFuncion(
        @Param('id', ParseIntPipe) id: number,
        @Body() datos: Partial<FuncionInput>,
    ): Promise<FuncionResponse> {
        return this.funcionService.updateFuncion(id, datos);
    }
*/
    @Get(':id/butacas-detalle')
    async getButacasDetails(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ButacasDetalleResponse> {
        return this.funcionService.getButacasDetails(id);
    }
}
