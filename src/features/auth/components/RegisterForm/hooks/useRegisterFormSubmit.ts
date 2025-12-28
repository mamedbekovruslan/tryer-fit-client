import { useState } from 'react';
import { clientService } from '@/services/clientService';
import { RegisterFormValues } from './useRegisterFormState';

export interface RegisterFormSubmitHandler {
  handleSubmit: (e: React.FormEvent, values: RegisterFormValues, onSwitchToLogin: () => void) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useRegisterFormSubmit = (): RegisterFormSubmitHandler => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, values: RegisterFormValues, onSwitchToLogin: () => void) => {
    e.preventDefault();

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      waistCircumference,
      chestCircumference,
      hipCircumference,
      armCircumference,
      legCircumference,
      fitnessGoal,
      expectedResult,
      contraindications,
      diseases,
      limitations,
      trainingExperience,
      currentDiet,
      photoUrls
    } = values;

    // Basic validation
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!email || !password || !firstName || !lastName) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create username from email or first and last name
      const username = email.split('@')[0]; // Using part of email as username

      const userResponse = await clientService.register({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        // Добавляем данные профиля клиента
        waist_circumference: waistCircumference ? Number(waistCircumference) : undefined,
        chest_circumference: chestCircumference ? Number(chestCircumference) : undefined,
        hip_circumference: hipCircumference ? Number(hipCircumference) : undefined,
        arm_circumference: armCircumference ? Number(armCircumference) : undefined,
        leg_circumference: legCircumference ? Number(legCircumference) : undefined,
        fitness_goal: fitnessGoal,
        expected_result: expectedResult,
        contraindications,
        diseases,
        limitations,
        training_experience: trainingExperience,
        current_diet: currentDiet,
        photo_urls: photoUrls,
      });

      // Завершаем регистрацию
      onSwitchToLogin();
    } catch (err) {
      console.error('Registration error:', err);
      setError('Ошибка регистрации. Пожалуйста, проверьте введенные данные и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
  };
};