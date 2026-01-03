import { useState } from 'react';
import { DateValue } from '@mantine/dates';

export interface RegisterFormValues {
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  height: string | number;
  weight: string | number;
  phone: string;
  birthDate: DateValue | null;

  // Поля тренера
  education: string;
  institution: string;
  degree: string;
  specialization: string;
  certificateNumber: string;

  // Поля профиля клиента
  waistCircumference: string | number;
  chestCircumference: string | number;
  hipCircumference: string | number;
  armCircumference: string | number;
  legCircumference: string | number;
  fitnessGoal: string;
  expectedResult: string;
  contraindications: string;
  diseases: string;
  limitations: string;
  trainingExperience: string;
  currentDiet: string;
  photoUrls: string[];
}

export interface RegisterFormHandlers {
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

export interface RegisterFormState extends RegisterFormValues, RegisterFormHandlers {
  loading: boolean;
  error: string | null;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
}

export const useRegisterFormState = (): RegisterFormState => {
  // Состояния для всех полей формы
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState<string | number>('');
  const [weight, setWeight] = useState<string | number>('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState<DateValue | null>(null);

  // Состояния для полей тренера
  const [education, setEducation] = useState('');
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');

  // Состояния для профиля клиента
  const [waistCircumference, setWaistCircumference] = useState<string | number>('');
  const [chestCircumference, setChestCircumference] = useState<string | number>('');
  const [hipCircumference, setHipCircumference] = useState<string | number>('');
  const [armCircumference, setArmCircumference] = useState<string | number>('');
  const [legCircumference, setLegCircumference] = useState<string | number>('');
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

  return {
    // Значения
    lastName,
    firstName,
    middleName,
    email,
    password,
    confirmPassword,
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
    photoUrls,

    // Обработчики
    setLastName,
    setFirstName,
    setMiddleName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setGender,
    setHeight,
    setWeight,
    setPhone,
    setBirthDate,
    setEducation,
    setInstitution,
    setDegree,
    setSpecialization,
    setCertificateNumber,
    setWaistCircumference,
    setChestCircumference,
    setHipCircumference,
    setArmCircumference,
    setLegCircumference,
    setFitnessGoal,
    setExpectedResult,
    setContraindications,
    setDiseases,
    setLimitations,
    setTrainingExperience,
    setCurrentDiet,
    setPhotoUrls,

    // Состояния загрузки и ошибок
    loading,
    error,
    setLoading,
    setError,
  };
};