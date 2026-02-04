export const config = {
    // 1. Si estas peticiones pasan por el Gateway, usa el 3000.
    // Pero para comunicación interna entre microservicios, lo ideal es ir al puerto directo.
    APIPeliculasUrls: {
        baseUrl: process.env.URL_MS_PELICULAS || 'http://localhost:3001',
        getPeliculaById: (id: number) => `/pelicula/admin/${id}`,
    },

    // 2. Usuarios (Asegúrate de qué puerto usa el micro de usuarios, suele ser 3001 o 3002)
    APIUsuariosUrls: {
        baseUrl: process.env.URL_MS_USUARIOS || 'http://localhost:3004',
        getDatosEmpleadoById: (id: number) =>
            `/microservicio-usuarios/datos-empleado/${id}`,
    },

    // 3. FUNCIONES (El que fallaba, ahora apuntando al 3003)
    APIFuncionesUrls: {
        baseUrl: process.env.URL_MS_FUNCIONES || 'http://localhost:3003',
    },

    // 4. PROMOCIONES (Ajusta el puerto si no es 3002)
    APIPromocionesUrls: {
        baseUrl: process.env.URL_MS_PROMOCIONES || 'http://localhost:3005',
    },

    // 5. MERCADO PAGO
    APIIntegracionMPUrls: {
        baseUrl: process.env.URL_MS_MERCADOPAGO || 'http://localhost:3007',
    },

    // 6. MAILS
    APIEnviarMailsUrls: {
        baseUrl: process.env.URL_MS_ENVIO_EMAILS || 'http://localhost:3008',
    },
};
