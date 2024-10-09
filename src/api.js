import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/users/register`, { username, password });
  return response.data;
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/users/login`, { username, password });
  return response.data;
};