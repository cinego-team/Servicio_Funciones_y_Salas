import { Module } from '@nestjs/common';
import { FuncionService } from './funcion.service';
import { FuncionController } from './funcion.controller';
import { Funcion } from 'src/entities/funcion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaService } from 'src/sala/sala.service';
import { EstadoDisponibilidadButacaService } from 'src/estado-disponibilidad-butaca/estado-disponibilidad-butaca.service';
import { DisponibilidadButacaService } from 'src/disponibilidad-butaca/disponibilidad-butaca.service';
import { FormatoService } from 'src/formato/formato.service';

@Module({
    imports: [TypeOrmModule.forFeature([Funcion])],
    controllers: [FuncionController],
    providers: [FuncionService, SalaService, FormatoService, EstadoDisponibilidadButacaService, DisponibilidadButacaService],
    exports: [FuncionService],
})
export class FuncionModule { }
