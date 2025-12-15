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

    @Get()
    async findAll(): Promise<SalaResponse[]> {
        return this.salaService.findAll();
    }

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
    @Get('admin/selec')
    async findAllSelect(): Promise<SalaResponseForSelec[]> {
        return this.salaService.getSalasForSelec();
    }
    @Get('admin/all')
    async findAllAdmin(): Promise<SalaResponse[]> {
        return this.salaService.getAllSalas();
    }
}
