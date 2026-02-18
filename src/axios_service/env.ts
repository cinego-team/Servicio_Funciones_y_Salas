export const config = {
    APIPeliculasUrls: {
        baseUrl: 'http://localhost:3001',
        getPeliculaById: (id: number) => `/pelicula/admin/${id}`,
    },

    APIUsuariosUrls: {
        baseUrl: 'http://localhost:3004',
        getDatosEmpleadoById: (id: number) =>
            `/microservicio-usuarios/datos-empleado/${id}`,
    }
};
