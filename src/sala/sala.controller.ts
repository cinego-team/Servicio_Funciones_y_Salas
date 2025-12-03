import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SalaService } from './sala.service';
import { SalaInput, SalaResponse } from './dto';

@Controller('salas')
export class SalaController {
    constructor(private readonly salaService: SalaService) { }

    @Post()
    async create(@Body() data: SalaInput): Promise<SalaResponse> {
        return this.salaService.create(data);
    }

    @Get()
    async findAll(): Promise<SalaResponse[]> {
        return this.salaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SalaResponse> {
        return this.salaService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: Partial<SalaInput>,
    ): Promise<SalaResponse> {
        return this.salaService.update(id, data);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.salaService.remove(id);
    }
}