import axios from 'axios';
import { config } from './env';

export const axiosAPIUsuarios = axios.create({
    baseURL: config.APIUsuariosUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAPIUsuarios.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (token) {
        config.headers.Authorization = token;
    }
    if (refreshToken) {
        config.headers['refresh-token'] = refreshToken;
    }

    return config;
});

export const axiosAPIPeliculas = axios.create({
    baseURL: config.APIPeliculasUrls.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAPIPeliculas.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (token) {
        config.headers.Authorization = token;
    }
    if (refreshToken) {
        config.headers['refresh-token'] = refreshToken;
    }

    return config;
});