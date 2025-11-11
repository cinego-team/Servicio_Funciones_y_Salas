import { Module } from '@nestjs/common';
import { DisponibilidadButacaService } from './disponibilidad-butaca.service';
import { DisponibilidadButacaController } from './disponibilidad-butaca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisponibilidadButaca } from 'src/entities/disponibilidadButaca.entity';
import { Funcion } from 'src/entities/funcion.entity';
import { Butaca } from 'src/entities/butaca.entity';
import { EstadoDisponibilidadButaca } from 'src/entities/estadoDisponibilidadButaca.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DisponibilidadButaca,
            Funcion,
            Butaca,
            EstadoDisponibilidadButaca,
        ]),
    ],
    controllers: [DisponibilidadButacaController],
    providers: [DisponibilidadButacaService],
})
export class DisponibilidadButacaModule { }
