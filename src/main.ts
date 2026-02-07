import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.enableCors({
        origin: [
            'https://apigateway-v5pv.onrender.com',
            'https://servicio-usuarios-ejqg.onrender.com',
            'https://microservicio-de-peliculas.onrender.com',
            'https://serviciopromociones-wftn.onrender.com',
            'https://servicioventas.onrender.com',
            'https://servicio-envio-emails.onrender.com',
            'https://servicio-integracion-mercadopago.onrender.com'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    await app.listen(3003);
}
bootstrap();
