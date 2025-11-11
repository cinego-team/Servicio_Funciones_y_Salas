import { Module } from '@nestjs/common';
import { ButacaService } from './butaca.service';
import { ButacaController } from './butaca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Butaca } from 'src/entities/butaca.entity';
import { DisponibilidadButaca } from 'src/entities/disponibilidadButaca.entity';
import { Fila } from 'src/entities/fila.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Butaca, Fila, DisponibilidadButaca])],
    controllers: [ButacaController],
    providers: [ButacaService],
    exports: [ButacaService],
})
export class ButacaModule { }
