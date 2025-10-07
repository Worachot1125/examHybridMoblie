import axios from 'axios';
import { Platform } from 'react-native';

const PORT = 8000;
const LAN = `http://192.168.0.190:${PORT}`;

const getBaseURL = () => {
  if (Platform.OS === 'android') return __DEV__ ? LAN : LAN;
  return __DEV__ ? LAN : LAN;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token?: string) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};