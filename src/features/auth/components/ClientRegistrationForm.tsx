import {
  TextInput,
  PasswordInput,
  Select,
  NumberInput,
  TextInputProps,
  PasswordInputProps,
  SelectProps,
  NumberInputProps,
  Divider,
  TextareaProps,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { DateValue } from '@mantine/dates/lib/types';

interface ClientRegistrationFormProps {
  commonFields: {
    lastName: string;
    setLastName: (value: string) => void;
    firstName: string;
    setFirstName: (value: string) => void;
    middleName: string;
    setMiddleName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    gender: string;
    setGender: (value: string) => void;
    height: number | '';
    setHeight: (value: number | '') => void;
    weight: number | '';
    setWeight: (value: number | '') => void;
    phone: string;
    setPhone: (value: string) => void;
    birthDate: DateValue | null;
    setBirthDate: (value: DateValue | null) => void;
  };
}

export default function ClientRegistrationForm({ commonFields }: ClientRegistrationFormProps) {
  return (
    <>
      <TextInput
        label="Фамилия"
        placeholder="Иванов"
        value={commonFields.lastName}
        onChange={(e) => commonFields.setLastName(e.currentTarget.value)}
        required
        mt="md"
      />
      <TextInput
        label="Имя"
        placeholder="Иван"
        value={commonFields.firstName}
        onChange={(e) => commonFields.setFirstName(e.currentTarget.value)}
        required
        mt="md"
      />
      <TextInput
        label="Отчество"
        placeholder="Иванович"
        value={commonFields.middleName}
        onChange={(e) => commonFields.setMiddleName(e.currentTarget.value)}
        mt="md"
      />

      <TextInput
        label="Электронная почта"
        placeholder="your@email.com"
        value={commonFields.email}
        onChange={(e) => commonFields.setEmail(e.currentTarget.value)}
        required
        mt="md"
      />

      <PasswordInput
        label="Пароль"
        placeholder="Введите пароль"
        value={commonFields.password}
        onChange={(e) => commonFields.setPassword(e.currentTarget.value)}
        required
        mt="md"
      />

      <PasswordInput
        label="Подтверждение пароля"
        placeholder="Повторите пароль"
        value={commonFields.confirmPassword}
        onChange={(e) => commonFields.setConfirmPassword(e.currentTarget.value)}
        required
        mt="md"
      />

      <Select
        label="Пол"
        placeholder="Выберите пол"
        data={['Мужской', 'Женский']}
        value={commonFields.gender}
        onChange={(value) => value && commonFields.setGender(value)}
        required
        mt="md"
      />

      <NumberInput
        label="Рост (см)"
        placeholder="175"
        value={commonFields.height}
        onChange={commonFields.setHeight}
        min={50}
        max={300}
        mt="md"
      />

      <NumberInput
        label="Вес (кг)"
        placeholder="70"
        value={commonFields.weight}
        onChange={commonFields.setWeight}
        min={1}
        max={500}
        mt="md"
      />

      <TextInput
        label="Номер телефона"
        placeholder="+7 (XXX) XXX-XXXX"
        value={commonFields.phone}
        onChange={(e) => commonFields.setPhone(e.currentTarget.value)}
        required
        mt="md"
      />

      <Divider my="sm" />

      <DateInput
        label="Дата рождения"
        placeholder="Выберите дату"
        value={commonFields.birthDate}
        onChange={commonFields.setBirthDate}
        mt="md"
      />
    </>
  );
}