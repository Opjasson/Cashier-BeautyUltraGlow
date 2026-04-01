const API_HOST = "10.70.252.12";
const API_PORT = "5000";

export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;

export const apiUrl = (path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};
