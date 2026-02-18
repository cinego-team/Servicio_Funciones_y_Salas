import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilaModule } from './fila/fila.module';
import { ButacaModule } from './butaca/butaca.module';
import { EstadoDisponibilidadButacaModule } from './estado-disponibilidad-butaca/estado-disponibilidad-butaca.module';
import { DisponibilidadButacaModule } from './disponibilidad-butaca/disponibilidad-butaca.module';
import { FormatoModule } from './formato/formato.module';
import { FuncionModule } from './funcion/funcion.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DisponibilidadButaca } from './entities/disponibilidadButaca.entity';
import { Butaca } from './entities/butaca.entity';
import { EstadoDisponibilidadButaca } from './entities/estadoDisponibilidadButaca.entity';
import { Fila } from './entities/fila.entity';
import { Formato } from './entities/formato.entity';
import { Funcion } from './entities/funcion.entity';
import { Sala } from './entities/sala.entity';
import { IdiomaModule } from './idioma/idioma.module';
import { Idioma } from './entities/idioma.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: Number(process.env.PUERTO_BD),
            database: process.env.PG_DATABASE_MS_USUARIOS,
            username: process.env.PG_USERNAME,
            password: process.env.PG_PASSWORD,
            synchronize: true,
            entities: [
                Butaca,
                DisponibilidadButaca,
                EstadoDisponibilidadButaca,
                Fila,
                Formato,
                Funcion,
                Sala,
                Idioma,
            ],
        }),
        ButacaModule,
        DisponibilidadButacaModule,
        EstadoDisponibilidadButacaModule,
        FilaModule,
        FormatoModule,
        FuncionModule,
        FilaModule,
        IdiomaModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }