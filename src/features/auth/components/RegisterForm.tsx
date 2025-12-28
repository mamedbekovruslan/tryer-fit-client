'use client';

import { useState } from 'react';
import { Button, Text, Anchor, Tabs, Divider, Alert } from '@mantine/core';
import { DateValue } from '@mantine/dates/lib/types';
import { IoIosArrowBack } from 'react-icons/io';
import ClientRegistrationForm from './ClientRegistrationForm';
import TrainerRegistrationForm from './TrainerRegistrationForm';
import { clientService } from '@/services/clientService';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [userType, setUserType] = useState<'client' | 'trainer'>('client');

  // Состояния для всех полей формы
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState<DateValue | null>(null);

  // Состояния для полей тренера
  const [education, setEducation] = useState('');
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');

  // Состояния для профиля клиента
  const [waistCircumference, setWaistCircumference] = useState<number | ''>('');
  const [chestCircumference, setChestCircumference] = useState<number | ''>('');
  const [hipCircumference, setHipCircumference] = useState<number | ''>('');
  const [armCircumference, setArmCircumference] = useState<number | ''>('');
  const [legCircumference, setLegCircumference] = useState<number | ''>('');
  const [fitnessGoal, setFitnessGoal] = useState<string>('');
  const [expectedResult, setExpectedResult] = useState<string>('');
  const [contraindications, setContraindications] = useState<string>('');
  const [diseases, setDiseases] = useState<string>('');
  const [limitations, setLimitations] = useState<string>('');
  const [trainingExperience, setTrainingExperience] = useState<string>('');
  const [currentDiet, setCurrentDiet] = useState<string>('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // Состояния для обработки ошибок и загрузки
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        // Добавляем данные профиля, если клиент - клиент
        ...(userType === 'client' && {
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
        }),
      });

      // Всё регистрируется в одном запросе, больше не нужна отдельная логика

      // Завершаем регистрацию
      onSwitchToLogin();
    } catch (err) {
      console.error('Registration error:', err);
      setError('Ошибка регистрации. Пожалуйста, проверьте введенные данные и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const commonFields = {
    lastName,
    setLastName,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    gender,
    setGender,
    height,
    setHeight,
    weight,
    setWeight,
    phone,
    setPhone,
    birthDate,
    setBirthDate,
    // Поля тренера
    education,
    setEducation,
    institution,
    setInstitution,
    degree,
    setDegree,
    specialization,
    setSpecialization,
    certificateNumber,
    setCertificateNumber,
    // Поля профиля клиента
    waistCircumference,
    setWaistCircumference,
    chestCircumference,
    setChestCircumference,
    hipCircumference,
    setHipCircumference,
    armCircumference,
    setArmCircumference,
    legCircumference,
    setLegCircumference,
    fitnessGoal,
    setFitnessGoal,
    expectedResult,
    setExpectedResult,
    contraindications,
    setContraindications,
    diseases,
    setDiseases,
    limitations,
    setLimitations,
    trainingExperience,
    setTrainingExperience,
    currentDiet,
    setCurrentDiet,
    photoUrls,
    setPhotoUrls,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Вернуться к авторизации"
        >
          <IoIosArrowBack size={20} />
          <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Назад</span>
        </button>
      </div>

      <Tabs value={userType} onChange={(value: string | null) => value && setUserType(value as 'client' | 'trainer')} mb="md">
        <Tabs.List>
          <Tabs.Tab value="client">Клиент</Tabs.Tab>
          <Tabs.Tab value="trainer">Тренер</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Divider my="sm" />

      {userType === 'client' ? (
        <ClientRegistrationForm commonFields={commonFields} />
      ) : (
        <TrainerRegistrationForm commonFields={commonFields} />
      )}

      {error && (
        <Alert title="Ошибка регистрации" color="red" mt="md">
          {error}
        </Alert>
      )}

      <Button fullWidth mt="xl" type="submit" loading={loading}>
        Зарегистрироваться
      </Button>

      <Text ta="center" mt="md">
        Уже есть аккаунт?{' '}
        <Anchor
          component="button"
          type="button"
          fw={500}
          onClick={onSwitchToLogin}
        >
          Войти
        </Anchor>
      </Text>
    </form>
  );
}