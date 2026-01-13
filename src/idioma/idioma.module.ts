import { Module } from '@nestjs/common';
import { IdiomaService } from './idioma.service';
import { IdiomaController } from './idioma.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Idioma } from '../entities/idioma.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Idioma]), // 🔑 ESTA ES LA SOLUCIÓN
    ],
    controllers: [IdiomaController],
    providers: [IdiomaService],
    exports: [IdiomaService],
})
export class IdiomaModule {}
