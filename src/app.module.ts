import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilaModule } from './fila/fila.module';
import { ButacaModule } from './butaca/butaca.module';
import { EstadoDisponibilidadButacaModule } from './estado-disponibilidad-butaca/estado-disponibilidad-butaca.module';
import { DisponibilidadButacaModule } from './disponibilidad-butaca/disponibilidad-butaca.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisponibilidadButaca } from './entities/disponibilidadButaca.entity';
import { Butaca } from './entities/butaca.entity';
import { EstadoDisponibilidadButaca } from './entities/estadoDisponibilidadButaca.entity';
import { Fila } from './entities/fila.entity';
import { Formato } from './entities/formato.entity';
import { Funcion } from './entities/funcion.entity';
import { Sala } from './entities/sala.entity';

@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'msfuncionesysalas',
        username: 'postgres',
        password: 'grupou',
        entities: [Butaca, DisponibilidadButaca, EstadoDisponibilidadButaca, Fila, Formato, Funcion, Sala],
        synchronize: true,
    }),
        FilaModule,
        ButacaModule,
        EstadoDisponibilidadButacaModule,
        DisponibilidadButacaModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
