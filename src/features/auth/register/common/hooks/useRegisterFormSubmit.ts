import { useState } from 'react';
import { clientService } from '@/services/clientService';
import { trainerService } from '@/services/trainerService';
import { authService } from '@/services/authService';
import { RegisterFormValues } from './useRegisterFormState';

export interface RegisterFormSubmitHandler {
  handleSubmit: (e: React.FormEvent, values: RegisterFormValues, userType: 'client' | 'trainer', onSwitchToLogin: () => void) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useRegisterFormSubmit = (): RegisterFormSubmitHandler => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, values: RegisterFormValues, userType: 'client' | 'trainer', onSwitchToLogin: () => void) => {
    e.preventDefault();

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      middleName,
      gender,
      height,
      weight,
      phone,
      birthDate,
      // Поля тренера
      education,
      institution,
      degree,
      specialization,
      certificateNumber,
      // Поля профиля клиента
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

      if (userType === 'client') {
        // Client registration
        await clientService.register({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          // Добавляем данные профиля клиента
          waist_circumference: waistCircumference ? (typeof waistCircumference === 'string' ? Number(waistCircumference) : Number(waistCircumference)) : undefined,
          chest_circumference: chestCircumference ? (typeof chestCircumference === 'string' ? Number(chestCircumference) : Number(chestCircumference)) : undefined,
          hip_circumference: hipCircumference ? (typeof hipCircumference === 'string' ? Number(hipCircumference) : Number(hipCircumference)) : undefined,
          arm_circumference: armCircumference ? (typeof armCircumference === 'string' ? Number(armCircumference) : Number(armCircumference)) : undefined,
          leg_circumference: legCircumference ? (typeof legCircumference === 'string' ? Number(legCircumference) : Number(legCircumference)) : undefined,
          fitness_goal: fitnessGoal,
          expected_result: expectedResult,
          contraindications,
          diseases,
          limitations,
          training_experience: trainingExperience,
          current_diet: currentDiet,
          photo_urls: photoUrls,
        });
      } else {
        // Trainer registration
        await trainerService.register({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          middle_name: middleName,
          gender,
          height: height ? (typeof height === 'string' ? Number(height) : height) : undefined,
          weight: weight ? (typeof weight === 'string' ? Number(weight) : weight) : undefined,
          phone,
          birth_date: birthDate ? new Date(birthDate).toISOString().split('T')[0] : undefined, // Format as YYYY-MM-DD
          // Данные профиля тренера
          education,
          institution,
          degree,
          specialization,
          certificate_number: certificateNumber,
          photo_urls: photoUrls,
        });
      }

      // После успешной регистрации, сразу выполняем вход
      const loginResponse = await authService.login({ email, password });

      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', loginResponse.access_token);
      localStorage.setItem('user', JSON.stringify(loginResponse.user));

      // Перенаправляем в зависимости от типа пользователя
      if (loginResponse.user.user_type === 'trainer') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/home';
      }
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
