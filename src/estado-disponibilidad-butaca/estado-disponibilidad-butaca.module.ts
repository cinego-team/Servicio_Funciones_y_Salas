import { Module } from '@nestjs/common';
import { EstadoDisponibilidadButacaService } from './estado-disponibilidad-butaca.service';
import { EstadoDisponibilidadButacaController } from './estado-disponibilidad-butaca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoDisponibilidadButaca } from 'src/entities/estadoDisponibilidadButaca.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EstadoDisponibilidadButaca])],
    controllers: [EstadoDisponibilidadButacaController],
    providers: [EstadoDisponibilidadButacaService],
    exports: [EstadoDisponibilidadButacaService],
})
export class EstadoDisponibilidadButacaModule { }
