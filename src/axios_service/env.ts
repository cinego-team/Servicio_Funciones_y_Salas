export const config = {

    APIPeliculasUrls: {
        baseUrl: 'http://localhost:3000',
        getPeliculaById: (id: number) => `microservicio-peliculas/pelicula/${id}`,

    },
    APIUsuariosUrls: {
        baseUrl: 'http://localhost:3000',
        getDatosEmpleadoById: (id: number) => `microservicio-usuarios/datos-empleado/${id}`
    }

}