import axios from 'axios';
import { config } from './env';

export const axiosAPIUsuarios = axios.create({
    baseURL: config.APIUsuariosUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosAPIPeliculas = axios.create({
    baseURL: config.APIPeliculasUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});