import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { IdiomaService } from './idioma.service';
import { IdiomaInput, IdiomaResponse } from './dto';

@Controller('idioma')
export class IdiomaController {
    constructor(private readonly service: IdiomaService) {}

    @Post('admin/new')
    new(@Body() dto: IdiomaInput) {
        return this.service.newIdioma(dto);
    }

    @Get('admin/all')
    getAll(@Query('page') page = '1', @Query('quantity') quantity = '10') {
        return this.service.getAllIdiomas(Number(page), Number(quantity));
    }

    @Get('admin/:id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.service.getIdiomaById(id);
    }

    @Put('admin/:id')
    updateFull(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: IdiomaInput,
    ) {
        return this.service.updateIdioma(id, dto);
    }

    @Patch(':id')
    updatePartial(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: Partial<IdiomaInput>,
    ) {
        return this.service.partialUpdateIdioma(id, dto);
    }

    @Delete('admin/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.deleteIdiomaById(id);
    }
    @Get('admin/:id')
    async getIdiomaById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<IdiomaResponse> {
        const idiomaEntity = await this.service.getIdiomaByIdForPut(id);

        return {
            id: idiomaEntity.id,
            nombre: idiomaEntity.nombre,
        };
    }
}
