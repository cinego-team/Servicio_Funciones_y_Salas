import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisponibilidadButacaModule } from '../disponibilidad-butaca/disponibilidad-butaca.module';
import { SalaModule } from '../sala/sala.module';
import { FormatoModule } from '../formato/formato.module';
import { EstadoDisponibilidadButacaModule } from '../estado-disponibilidad-butaca/estado-disponibilidad-butaca.module';
import { FuncionController } from './funcion.controller';
import { FuncionService } from './funcion.service';
import { Funcion } from '../entities/funcion.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Funcion]),
        forwardRef(() => DisponibilidadButacaModule),
        forwardRef(() => SalaModule),
        FormatoModule,
        EstadoDisponibilidadButacaModule,
    ],
    controllers: [FuncionController],
    providers: [FuncionService],
    exports: [FuncionService],
})
export class FuncionModule { }
