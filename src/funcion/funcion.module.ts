import { Module } from '@nestjs/common';
import { FuncionService } from './funcion.service';
import { FuncionController } from './funcion.controller';
import { Funcion } from 'src/entities/funcion.entity';
import { Formato } from 'src/entities/formato.entity';
import { Sala } from 'src/entities/sala.entity';
import { DisponibilidadButaca } from 'src/entities/disponibilidadButaca.entity';
import { EstadoDisponibilidadButaca } from 'src/entities/estadoDisponibilidadButaca.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Funcion, Formato, Sala, DisponibilidadButaca, EstadoDisponibilidadButaca])],
    controllers: [FuncionController],
    providers: [FuncionService],
    exports: [FuncionService],
})
export class FuncionModule { }
