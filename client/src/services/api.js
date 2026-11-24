import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, dispatch event so auth context can handle clean signout
      if (localStorage.getItem('taskflow_token')) {
        window.dispatchEvent(new CustomEvent('taskflow_auth_expired'));
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  async signup(data) {
    const res = await apiClient.post('/signup', data);
    return res.data;
  },

  async login(credentials) {
    const res = await apiClient.post('/login', credentials);
    return res.data;
  },

  async getProfile() {
    const res = await apiClient.get('/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await apiClient.put('/profile', data);
    return res.data;
  },

  async getUsers() {
    const res = await apiClient.get('/users');
    return res.data;
  }
};

export const taskApi = {
  async getTasks(params = {}) {
    const res = await apiClient.get('/tasks', { params });
    return res.data;
  },

  async getMyTasks(params = {}) {
    const res = await apiClient.get('/my-tasks', { params });
    return res.data;
  },

  async getTaskById(id) {
    const res = await apiClient.get(`/tasks/${id}`);
    return res.data;
  },


  async createTask(taskData) {
    const res = await apiClient.post('/tasks', taskData);
    return res.data;
  },

  async updateTask(id, taskData) {
    const res = await apiClient.put(`/tasks/${id}`, taskData);
    return res.data;
  },

  async deleteTask(id) {
    const res = await apiClient.delete(`/tasks/${id}`);
    return res.data;
  }
};

export default apiClient;
