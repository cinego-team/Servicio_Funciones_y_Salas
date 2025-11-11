import { Module } from '@nestjs/common';
import { FilaService } from './fila.service';
import { FilaController } from './fila.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fila } from 'src/entities/fila.entity';
import { Sala } from 'src/entities/sala.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Fila, Sala])],
    controllers: [FilaController],
    providers: [FilaService],
    exports: [FilaService],
})
export class FilaModule { }
