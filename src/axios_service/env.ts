export const config = {
    // 1. Si estas peticiones pasan por el Gateway, usa el 3000.
    // Pero para comunicación interna entre microservicios, lo ideal es ir al puerto directo.
    APIPeliculasUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_PELICULAS}`,
        getPeliculaById: (id: number) => `/pelicula/admin/${id}`,
    },

    // 2. Usuarios (Asegúrate de qué puerto usa el micro de usuarios, suele ser 3001 o 3002)
    APIUsuariosUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_USUARIOS}`,
        getDatosEmpleadoById: (id: number) =>
            `/microservicio-usuarios/datos-empleado/${id}`,
    },

    // 3. FUNCIONES (El que fallaba, ahora apuntando al 3003)
    APIFuncionesUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_FUNCIONES_Y_SALAS}`,
    },

    // 4. PROMOCIONES (Ajusta el puerto si no es 3002)
    APIPromocionesUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_PROMOCIONES}`,
    },

    // 5. MERCADO PAGO
    APIIntegracionMPUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_MERCADOPAGO}`,
    },

    // 6. MAILS
    APIEnviarMailsUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_ENVIO_EMAILS}`,
    },
};
