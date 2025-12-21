import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор запросов для добавления токенов аутентификации при необходимости
apiClient.interceptors.request.use(
  (config) => {
    // Вы можете добавить заголовки аутентификации здесь позже
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор ответов для глобальной обработки ответов
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Обработка глобальных ошибок ответов здесь
    console.error('Ошибка API:', error);
    return Promise.reject(error);
  }
);

export default apiClient;