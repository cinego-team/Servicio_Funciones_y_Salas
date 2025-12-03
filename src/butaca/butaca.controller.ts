import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ButacaService } from './butaca.service';
import { ButacaInput, ButacaResponse } from './dto';

@Controller('butaca')
export class ButacaController {
    constructor(private readonly butacaService: ButacaService) { }

    @Get()
    async findAll(): Promise<ButacaResponse[]> {
        return this.butacaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ButacaResponse> {
        return this.butacaService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<ButacaInput>
    ): Promise<ButacaResponse> {
        return this.butacaService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.butacaService.remove(id);
    }
}
