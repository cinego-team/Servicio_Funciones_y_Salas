import { Module } from '@nestjs/common';
import { FilaService } from './fila.service';
import { FilaController } from './fila.controller';

@Module({
  controllers: [FilaController],
  providers: [FilaService],
})
export class FilaModule {}
