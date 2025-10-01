import { Module } from '@nestjs/common';
import { FuncionService } from './funcion.service';
import { FuncionController } from './funcion.controller';

@Module({
  controllers: [FuncionController],
  providers: [FuncionService],
})
export class FuncionModule {}
