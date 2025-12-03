import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoDisponibilidadButacaController } from './estado-disponibilidad-butaca.controller';
import { EstadoDisponibilidadButacaService } from './estado-disponibilidad-butaca.service';
import { EstadoDisponibilidadButaca } from '../entities/estadoDisponibilidadButaca.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EstadoDisponibilidadButaca])],
    controllers: [EstadoDisponibilidadButacaController],
    providers: [EstadoDisponibilidadButacaService],
    exports: [EstadoDisponibilidadButacaService],
})
export class EstadoDisponibilidadButacaModule { }
