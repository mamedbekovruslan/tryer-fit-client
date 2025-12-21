'use client';

import { useState } from 'react';
import { Button, Text, Anchor, Tabs, Divider } from '@mantine/core';
import { DateValue } from '@mantine/dates/lib/types';
import { IoIosArrowBack } from 'react-icons/io';
import ClientRegistrationForm from './ClientRegistrationForm';
import TrainerRegistrationForm from './TrainerRegistrationForm';

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
    setCertificateNumber
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
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

      <Button fullWidth mt="xl" type="submit">
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