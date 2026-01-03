'use client';

import { useState } from 'react';
import { Button, Text, Anchor, Tabs, Divider, Alert } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { IoIosArrowBack } from 'react-icons/io';
import ClientRegistrationForm from '@/features/auth/register/client/ui/ClientRegistrationForm'; // Путь к существующему компоненту
import TrainerRegistrationForm from '@/features/auth/register/trainer/ui/TrainerRegistrationForm'; // Путь к существующему компоненту
import { useRegisterFormState, RegisterFormValues, RegisterFormHandlers } from '@/features/auth/register/common/hooks/useRegisterFormState';
import { useRegisterFormSubmit } from '@/features/auth/register/common/hooks/useRegisterFormSubmit';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

// Тип для объединения значений и обработчиков
type CommonFields = RegisterFormValues & RegisterFormHandlers;

// Тип для адаптированных полей, совместимых с компонентами (number | '')
interface AdaptedCommonFields {
  // Значения
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  height: number | '';
  weight: number | '';
  phone: string;
  birthDate: DateValue | null;

  // Поля тренера
  education: string;
  institution: string;
  degree: string;
  specialization: string;
  certificateNumber: string;

  // Поля профиля клиента
  waistCircumference: number | '';
  chestCircumference: number | '';
  hipCircumference: number | '';
  armCircumference: number | '';
  legCircumference: number | '';
  fitnessGoal: string;
  expectedResult: string;
  contraindications: string;
  diseases: string;
  limitations: string;
  trainingExperience: string;
  currentDiet: string;
  photoUrls: string[];

  // Обработчики
  setLastName: (value: string) => void;
  setFirstName: (value: string) => void;
  setMiddleName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setGender: (value: string) => void;
  setHeight: (value: number | '') => void;
  setWeight: (value: number | '') => void;
  setPhone: (value: string) => void;
  setBirthDate: (value: DateValue | null) => void;

  // Обработчики полей тренера
  setEducation: (value: string) => void;
  setInstitution: (value: string) => void;
  setDegree: (value: string) => void;
  setSpecialization: (value: string) => void;
  setCertificateNumber: (value: string) => void;

  // Обработчики полей профиля клиента
  setWaistCircumference: (value: number | '') => void;
  setChestCircumference: (value: number | '') => void;
  setHipCircumference: (value: number | '') => void;
  setArmCircumference: (value: number | '') => void;
  setLegCircumference: (value: number | '') => void;
  setFitnessGoal: (value: string) => void;
  setExpectedResult: (value: string) => void;
  setContraindications: (value: string) => void;
  setDiseases: (value: string) => void;
  setLimitations: (value: string) => void;
  setTrainingExperience: (value: string) => void;
  setCurrentDiet: (value: string) => void;
  setPhotoUrls: (value: string[]) => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [userType, setUserType] = useState<'client' | 'trainer'>('client');

  const formState = useRegisterFormState();
  const { handleSubmit: handleFormSubmit, loading, error } = useRegisterFormSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    await handleFormSubmit(e, formState, onSwitchToLogin);
  };

  // Адаптер для конвертации типов между хуком (string | number) и компонентами (number | '')
  const adaptedCommonFields: AdaptedCommonFields = {
    // Значения
    lastName: formState.lastName,
    firstName: formState.firstName,
    middleName: formState.middleName,
    email: formState.email,
    password: formState.password,
    confirmPassword: formState.confirmPassword,
    gender: formState.gender,
    height: typeof formState.height === 'number' ? (formState.height === 0 ? 0 : formState.height) : formState.height === '' ? '' : Number(formState.height),
    weight: typeof formState.weight === 'number' ? (formState.weight === 0 ? 0 : formState.weight) : formState.weight === '' ? '' : Number(formState.weight),
    phone: formState.phone,
    birthDate: formState.birthDate,
    education: formState.education,
    institution: formState.institution,
    degree: formState.degree,
    specialization: formState.specialization,
    certificateNumber: formState.certificateNumber,
    waistCircumference: typeof formState.waistCircumference === 'number' ? (formState.waistCircumference === 0 ? 0 : formState.waistCircumference) : formState.waistCircumference === '' ? '' : Number(formState.waistCircumference),
    chestCircumference: typeof formState.chestCircumference === 'number' ? (formState.chestCircumference === 0 ? 0 : formState.chestCircumference) : formState.chestCircumference === '' ? '' : Number(formState.chestCircumference),
    hipCircumference: typeof formState.hipCircumference === 'number' ? (formState.hipCircumference === 0 ? 0 : formState.hipCircumference) : formState.hipCircumference === '' ? '' : Number(formState.hipCircumference),
    armCircumference: typeof formState.armCircumference === 'number' ? (formState.armCircumference === 0 ? 0 : formState.armCircumference) : formState.armCircumference === '' ? '' : Number(formState.armCircumference),
    legCircumference: typeof formState.legCircumference === 'number' ? (formState.legCircumference === 0 ? 0 : formState.legCircumference) : formState.legCircumference === '' ? '' : Number(formState.legCircumference),
    fitnessGoal: formState.fitnessGoal,
    expectedResult: formState.expectedResult,
    contraindications: formState.contraindications,
    diseases: formState.diseases,
    limitations: formState.limitations,
    trainingExperience: formState.trainingExperience,
    currentDiet: formState.currentDiet,
    photoUrls: formState.photoUrls,

    // Обработчики
    setLastName: formState.setLastName,
    setFirstName: formState.setFirstName,
    setMiddleName: formState.setMiddleName,
    setEmail: formState.setEmail,
    setPassword: formState.setPassword,
    setConfirmPassword: formState.setConfirmPassword,
    setGender: formState.setGender,
    setHeight: (value: number | '') => formState.setHeight(value === '' ? '' : value),
    setWeight: (value: number | '') => formState.setWeight(value === '' ? '' : value),
    setPhone: formState.setPhone,
    setBirthDate: formState.setBirthDate,
    setEducation: formState.setEducation,
    setInstitution: formState.setInstitution,
    setDegree: formState.setDegree,
    setSpecialization: formState.setSpecialization,
    setCertificateNumber: formState.setCertificateNumber,
    setWaistCircumference: (value: number | '') => formState.setWaistCircumference(value === '' ? '' : value),
    setChestCircumference: (value: number | '') => formState.setChestCircumference(value === '' ? '' : value),
    setHipCircumference: (value: number | '') => formState.setHipCircumference(value === '' ? '' : value),
    setArmCircumference: (value: number | '') => formState.setArmCircumference(value === '' ? '' : value),
    setLegCircumference: (value: number | '') => formState.setLegCircumference(value === '' ? '' : value),
    setFitnessGoal: formState.setFitnessGoal,
    setExpectedResult: formState.setExpectedResult,
    setContraindications: formState.setContraindications,
    setDiseases: formState.setDiseases,
    setLimitations: formState.setLimitations,
    setTrainingExperience: formState.setTrainingExperience,
    setCurrentDiet: formState.setCurrentDiet,
    setPhotoUrls: formState.setPhotoUrls,
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
        <ClientRegistrationForm commonFields={adaptedCommonFields} />
      ) : (
        <TrainerRegistrationForm commonFields={adaptedCommonFields} />
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