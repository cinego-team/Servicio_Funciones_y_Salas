import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormatoController } from './formato.controller';
import { FormatoService } from './formato.service';
import { Formato } from '../entities/formato.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Formato])],
    controllers: [FormatoController],
    providers: [FormatoService],
    exports: [FormatoService],
})
export class FormatoModule { }
