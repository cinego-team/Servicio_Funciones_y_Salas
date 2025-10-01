import { Module } from '@nestjs/common';
import { EstadoDisponibilidadButacaService } from './estado-disponibilidad-butaca.service';
import { EstadoDisponibilidadButacaController } from './estado-disponibilidad-butaca.controller';

@Module({
  controllers: [EstadoDisponibilidadButacaController],
  providers: [EstadoDisponibilidadButacaService],
})
export class EstadoDisponibilidadButacaModule {}
