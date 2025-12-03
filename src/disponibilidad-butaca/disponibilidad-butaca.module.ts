import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButacaModule } from '../butaca/butaca.module';
import { FuncionModule } from '../funcion/funcion.module';
import { EstadoDisponibilidadButacaModule } from '../estado-disponibilidad-butaca/estado-disponibilidad-butaca.module';
import { DisponibilidadButacaController } from './disponibilidad-butaca.controller';
import { DisponibilidadButacaService } from './disponibilidad-butaca.service';
import { DisponibilidadButaca } from '../entities/disponibilidadButaca.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DisponibilidadButaca]),
        forwardRef(() => ButacaModule),
        forwardRef(() => FuncionModule),
        EstadoDisponibilidadButacaModule,
    ],
    controllers: [DisponibilidadButacaController],
    providers: [DisponibilidadButacaService],
    exports: [DisponibilidadButacaService],
})
export class DisponibilidadButacaModule { }
