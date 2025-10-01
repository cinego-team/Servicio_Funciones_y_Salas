import { Module } from '@nestjs/common';
import { DisponibilidadButacaService } from './disponibilidad-butaca.service';
import { DisponibilidadButacaController } from './disponibilidad-butaca.controller';

@Module({
  controllers: [DisponibilidadButacaController],
  providers: [DisponibilidadButacaService],
})
export class DisponibilidadButacaModule {}
