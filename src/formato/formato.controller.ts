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
import { FormatoService } from './formato.service';
import { FormatoInput, FormatoResponse } from './dto';

@Controller('formato')
export class FormatoController {
    constructor(private readonly formatoService: FormatoService) {}

    @Post('new/admin')
    async create(@Body() body: FormatoInput): Promise<FormatoResponse> {
        return this.formatoService.create(body);
    }

    @Get()
    async findAll(): Promise<FormatoResponse[]> {
        return this.formatoService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<FormatoResponse> {
        return this.formatoService.findOne(id);
    }

    @Put(':id/admin')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<FormatoInput>,
    ): Promise<FormatoResponse> {
        return this.formatoService.update(id, body);
    }

    @Delete(':id/admin')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.formatoService.remove(id);
    }

    @Get('admin/all')
    async findAllAdmin(): Promise<FormatoResponse[]> {
        return this.formatoService.findAllAdmin();
    }
    @Get(':id/admin')
    async findOneAdmin(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<FormatoResponse> {
        return this.formatoService.findOneAdmin(id);
    }
    @Get(':id/admin')
    async findOneFormatoForPut(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<FormatoResponse> {
        const formatoEntity = await this.formatoService.findOneFormatoForPut(
            id,
        );

        return {
            id: formatoEntity.id,
            nombre: formatoEntity.nombre,
            precio: formatoEntity.precio,
        };
    }
}
