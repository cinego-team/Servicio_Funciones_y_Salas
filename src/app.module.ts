import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilaModule } from './fila/fila.module';
import { ButacaModule } from './butaca/butaca.module';
import { EstadoDisponibilidadButacaModule } from './estado-disponibilidad-butaca/estado-disponibilidad-butaca.module';
import { DisponibilidadButacaModule } from './disponibilidad-butaca/disponibilidad-butaca.module';

@Module({
  imports: [FilaModule, ButacaModule, EstadoDisponibilidadButacaModule, DisponibilidadButacaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
