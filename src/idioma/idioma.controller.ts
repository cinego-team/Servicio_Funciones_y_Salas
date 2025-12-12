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
import { IdiomaInput } from './dto';

@Controller('idioma')
export class IdiomaController {
    constructor(private readonly service: IdiomaService) {}

    @Post('new/admin')
    new(@Body() dto: IdiomaInput) {
        return this.service.newIdioma(dto);
    }

    @Get('admin')
    getAll(@Query('page') page = '1', @Query('quantity') quantity = '10') {
        return this.service.getAllIdiomas(Number(page), Number(quantity));
    }

    @Get(':id/admin')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.service.getIdiomaById(id);
    }

    @Put(':id/admin')
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

    @Delete(':id/admin')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.deleteIdiomaById(id);
    }
}
