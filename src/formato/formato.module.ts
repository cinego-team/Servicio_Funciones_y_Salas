import { Module } from '@nestjs/common';
import { FormatoService } from './formato.service';
import { FormatoController } from './formato.controller';

@Module({
  controllers: [FormatoController],
  providers: [FormatoService],
})
export class FormatoModule {}
