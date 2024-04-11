import axios, { type CreateAxiosDefaults } from "axios";

/* const VITE_BASE_URL_API = process.env.VITE_BASE_URL_API as string;
const ACCESS_TOKEN = process.env.VITE_ACCESS_TOKEN as string; */

const BASE_URL_API = "https://api.github.com";
const ACCESS_TOKEN = "";

const options: CreateAxiosDefaults = {
  baseURL: `${BASE_URL_API}/repos`,
  headers: {
    "Content-type": "application/json",
  },
};

const axiosWithAuth = axios.create(options);

axiosWithAuth.interceptors.request.use((config) => {
  if (config?.headers && ACCESS_TOKEN) config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;

  return config;
});

export { axiosWithAuth };
