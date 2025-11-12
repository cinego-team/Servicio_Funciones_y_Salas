import { Module } from '@nestjs/common';
import { SalaService } from './sala.service';
import { SalaController } from './sala.controller';
import { Sala } from 'src/entities/sala.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Sala])],
    controllers: [SalaController],
    providers: [SalaService],
    exports: [SalaService],
})
export class SalaModule { }
