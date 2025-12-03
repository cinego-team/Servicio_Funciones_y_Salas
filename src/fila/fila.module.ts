import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButacaModule } from '../butaca/butaca.module';
import { SalaModule } from '../sala/sala.module';
import { FilaController } from './fila.controller';
import { FilaService } from './fila.service';
import { Fila } from '../entities/fila.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Fila]),
        forwardRef(() => ButacaModule),
        forwardRef(() => SalaModule),
    ],
    controllers: [FilaController],
    providers: [FilaService],
    exports: [FilaService],
})
export class FilaModule { }
