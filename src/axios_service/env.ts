import { axiosAPIUsuarios } from "./axios.client";

 export const config = {

    APIPeliculasUrls: {
        baseUrl: 'http://localhost:3001',
        getPeliculaById: (id: number) => `/pelicula/${id}`,

    },
    APIUsuariosUrls: {
        baseUrl:'http://localhost:3002',
        getDatosEmpleadoById: (id: number) => `/usuarios/datos-empleado/${id}`
    }

}