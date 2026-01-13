import { useState } from 'react';
import { authService } from '@/services/authService';
import { useAuth } from '@/providers/AuthProvider';

export interface LoginHandler {
  handleLogin: (email: string, password: string, onSuccess?: (user: any) => void) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useLogin = (): LoginHandler => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string, onSuccess?: (user: any) => void) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      // Use the auth context to store the token and user data
      login(response.access_token, response.user);

      // Call the success callback if provided, passing the user data
      if (onSuccess) {
        onSuccess(response.user);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Неверные учетные данные. Пожалуйста, проверьте email и пароль.');
      } else {
        setError('Ошибка входа. Пожалуйста, проверьте введенные данные и попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
    error,
  };
};