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
import { SalaService } from './sala.service';
import { SalaInput, SalaResponse, SalaResponseForSelec } from './dto';

@Controller('salas')
export class SalaController {
    constructor(private readonly salaService: SalaService) {}

    @Post('admin/new')
    async create(@Body() data: SalaInput): Promise<SalaResponse> {
        return this.salaService.create(data);
    }

    // Rutas con parámetros DESPUÉS
    @Get('admin/:id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SalaResponse> {
        return this.salaService.findOne(id);
    }

    @Put('admin/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: Partial<SalaInput>,
    ): Promise<SalaResponse> {
        return this.salaService.update(id, data);
    }

    @Delete('admin/:id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.salaService.remove(id);
    }
}
