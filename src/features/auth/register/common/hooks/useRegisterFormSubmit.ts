import { useState } from 'react';
import { clientService } from '@/services/clientService';
import { trainerService } from '@/services/trainerService';
import { authService } from '@/services/authService';
import { RegisterFormValues } from './useRegisterFormState';
import { useAuth } from '@/providers/AuthProvider';

export interface RegisterFormSubmitHandler {
  handleSubmit: (e: React.FormEvent, values: RegisterFormValues, userType: 'client' | 'trainer') => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useRegisterFormSubmit = (): RegisterFormSubmitHandler => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, refreshUserProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent, values: RegisterFormValues, userType: 'client' | 'trainer') => {
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
      education,
      institution,
      degree,
      specialization,
      certificateNumber,
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
      const username = email.split('@')[0]; // Using part of email as username

      if (userType === 'client') {
        await clientService.register({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
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
          education,
          institution,
          degree,
          specialization,
          certificate_number: certificateNumber,
          photo_urls: photoUrls,
        });
      }

      const loginResponse = await authService.login({ email, password });

      login(loginResponse.access_token, loginResponse.user);
      await refreshUserProfile();

      if (loginResponse.user.user_type === 'trainer') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/home';
      }
    } catch (err) {
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
