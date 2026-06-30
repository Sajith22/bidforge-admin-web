import axios from 'axios';
import { auth } from './firebase';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Runs before every single request — grabs a fresh token and attaches it
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});