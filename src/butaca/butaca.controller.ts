import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ButacaService } from './butaca.service';
import { ButacaInput, ButacaResponse } from './dto';

@Controller('butaca')
export class ButacaController {
  constructor(private readonly butacaService: ButacaService) {}

  // Crear una butaca
  @Post()
  async create(@Body() body: ButacaInput): Promise<ButacaResponse> {
    return this.butacaService.create(body);
  }

  // Listar todas las butacas
  @Get()
  async findAll(): Promise<ButacaResponse[]> {
    return this.butacaService.findAll();
  }

  // Obtener una butaca por id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ButacaResponse> {
    return this.butacaService.findOne(id);
  }

  // Actualizar una butaca
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ButacaInput
  ): Promise<ButacaResponse> {
    return this.butacaService.update(id, body);
  }

  // Eliminar una butaca
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.butacaService.remove(id);
  }
}
