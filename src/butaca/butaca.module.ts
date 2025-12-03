import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisponibilidadButacaModule } from '../disponibilidad-butaca/disponibilidad-butaca.module';
import { FilaModule } from '../fila/fila.module';
import { ButacaController } from './butaca.controller';
import { ButacaService } from './butaca.service';
import { Butaca } from '../entities/butaca.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Butaca]),
        forwardRef(() => FilaModule),
        forwardRef(() => DisponibilidadButacaModule),
    ],
    controllers: [ButacaController],
    providers: [ButacaService],
    exports: [ButacaService],
})
export class ButacaModule { }
