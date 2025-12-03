import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FormatoService } from './formato.service';
import { FormatoInput, FormatoResponse } from './dto';

@Controller('formato')
export class FormatoController {
    constructor(private readonly formatoService: FormatoService) { }

    @Post()
    async create(@Body() body: FormatoInput): Promise<FormatoResponse> {
        return this.formatoService.create(body);
    }

    @Get()
    async findAll(): Promise<FormatoResponse[]> {
        return this.formatoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<FormatoResponse> {
        return this.formatoService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<FormatoInput>
    ): Promise<FormatoResponse> {
        return this.formatoService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.formatoService.remove(id);
    }
}
