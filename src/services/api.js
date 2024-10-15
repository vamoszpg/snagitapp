import config from '../config';
import axios from 'axios';

const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getSnags = async () => {
  try {
    const response = await api.get('/snags');
    return response.data;
  } catch (error) {
    console.error('Error fetching snags:', error);
    throw error;
  }
};

export const addSnag = async (snagData) => {
  try {
    const response = await api.post('/snags', snagData);
    return response.data;
  } catch (error) {
    console.error('Error adding snag:', error);
    throw error;
  }
};

export const updateSnag = async (id, snagData) => {
  try {
    const response = await api.put(`/snags/${id}`, snagData);
    return response.data;
  } catch (error) {
    console.error('Error updating snag:', error);
    throw error;
  }
};

export const deleteSnag = async (id) => {
  try {
    await api.delete(`/snags/${id}`);
  } catch (error) {
    console.error('Error deleting snag:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// ... rest of the file
