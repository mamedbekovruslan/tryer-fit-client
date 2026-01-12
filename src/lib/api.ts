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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

    // Проверяем, является ли ошибка связанной с аутентификацией (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Удаляем токен из localStorage, чтобы пользователь был разлогинен
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Вызываем событие storage, чтобы другие вкладки узнали об изменении
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'token',
        oldValue: localStorage.getItem('token'),
        newValue: null,
      }));
    }

    return Promise.reject(error);
  }
);

export default apiClient;