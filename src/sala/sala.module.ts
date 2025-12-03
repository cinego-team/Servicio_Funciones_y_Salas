import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilaModule } from '../fila/fila.module';
import { SalaController } from './sala.controller';
import { SalaService } from './sala.service';
import { Sala } from '../entities/sala.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sala]),
        forwardRef(() => FilaModule),
    ],
    controllers: [SalaController],
    providers: [SalaService],
    exports: [SalaService],
})
export class SalaModule { }
