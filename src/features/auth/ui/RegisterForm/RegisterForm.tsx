'use client';

import { useState } from 'react';
import { Button, Text, Anchor, Tabs, Divider, Alert } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { IoIosArrowBack } from 'react-icons/io';
import ClientRegistrationForm from '@/features/auth/register/client/ui/ClientRegistrationForm'; // Путь к существующему компоненту
import TrainerRegistrationForm from '@/features/auth/register/trainer/ui/TrainerRegistrationForm'; // Путь к существующему компоненту
import { useRegisterFormState } from '@/features/auth/register/common/hooks/useRegisterFormState';
import { useRegisterFormSubmit } from '@/features/auth/register/common/hooks/useRegisterFormSubmit';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

interface AdaptedCommonFields {
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

  education: string;
  institution: string;
  degree: string;
  specialization: string;
  certificateNumber: string;

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

  setEducation: (value: string) => void;
  setInstitution: (value: string) => void;
  setDegree: (value: string) => void;
  setSpecialization: (value: string) => void;
  setCertificateNumber: (value: string) => void;

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
    await handleFormSubmit(e, formState, userType);
  };

  const adaptedCommonFields: AdaptedCommonFields = {
    lastName: formState.lastName,
    firstName: formState.firstName,
    middleName: formState.middleName,
    email: formState.email,
    password: formState.password,
    confirmPassword: formState.confirmPassword,
    gender: formState.gender,
    height: formState.height,
    weight: formState.weight,
    phone: formState.phone,
    birthDate: formState.birthDate,
    education: formState.education,
    institution: formState.institution,
    degree: formState.degree,
    specialization: formState.specialization,
    certificateNumber: formState.certificateNumber,
    waistCircumference: formState.waistCircumference,
    chestCircumference: formState.chestCircumference,
    hipCircumference: formState.hipCircumference,
    armCircumference: formState.armCircumference,
    legCircumference: formState.legCircumference,
    fitnessGoal: formState.fitnessGoal,
    expectedResult: formState.expectedResult,
    contraindications: formState.contraindications,
    diseases: formState.diseases,
    limitations: formState.limitations,
    trainingExperience: formState.trainingExperience,
    currentDiet: formState.currentDiet,
    photoUrls: formState.photoUrls,

    setLastName: formState.setLastName,
    setFirstName: formState.setFirstName,
    setMiddleName: formState.setMiddleName,
    setEmail: formState.setEmail,
    setPassword: formState.setPassword,
    setConfirmPassword: formState.setConfirmPassword,
    setGender: formState.setGender,
    setHeight: formState.setHeight,
    setWeight: formState.setWeight,
    setPhone: formState.setPhone,
    setBirthDate: formState.setBirthDate,
    setEducation: formState.setEducation,
    setInstitution: formState.setInstitution,
    setDegree: formState.setDegree,
    setSpecialization: formState.setSpecialization,
    setCertificateNumber: formState.setCertificateNumber,
    setWaistCircumference: formState.setWaistCircumference,
    setChestCircumference: formState.setChestCircumference,
    setHipCircumference: formState.setHipCircumference,
    setArmCircumference: formState.setArmCircumference,
    setLegCircumference: formState.setLegCircumference,
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
