import { Module } from '@nestjs/common';
import { ButacaService } from './butaca.service';
import { ButacaController } from './butaca.controller';

@Module({
  controllers: [ButacaController],
  providers: [ButacaService],
})
export class ButacaModule {}
