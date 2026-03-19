import { memo, type ComponentProps } from 'react';
import {
  TextInput,
  PasswordInput,
  Select,
  NumberInput,
  Textarea,
  Divider,
  Avatar,
  Button,
  Group,
  Text,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Dropzone } from '@mantine/dropzone';
import { DropzoneAccept, DropzoneReject, DropzoneIdle } from '@mantine/dropzone';
import { DateValue } from '@mantine/dates';

interface TrainerRegistrationFormProps {
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
    education: string;
    setEducation: (value: string) => void;
    institution: string;
    setInstitution: (value: string) => void;
    degree: string;
    setDegree: (value: string) => void;
    specialization: string;
    setSpecialization: (value: string) => void;
    certificateNumber: string;
    setCertificateNumber: (value: string) => void;
    photoUrls: string[];
    setPhotoUrls: (value: string[]) => void;
  };
}

function numberOrEmpty(value: string | number): number | '' {
  return typeof value === 'number' ? value : '';
}

const MemoTextInput = memo(function MemoTextInput({
  value,
  setValue,
  ...props
}: Omit<ComponentProps<typeof TextInput>, 'value' | 'onChange'> & {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <TextInput
      {...props}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
});

const MemoPasswordInput = memo(function MemoPasswordInput({
  value,
  setValue,
  ...props
}: Omit<ComponentProps<typeof PasswordInput>, 'value' | 'onChange'> & {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <PasswordInput
      {...props}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
});

const MemoTextarea = memo(function MemoTextarea({
  value,
  setValue,
  ...props
}: Omit<ComponentProps<typeof Textarea>, 'value' | 'onChange'> & {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <Textarea
      {...props}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
});

const MemoNumberInput = memo(function MemoNumberInput({
  value,
  setValue,
  ...props
}: Omit<ComponentProps<typeof NumberInput>, 'value' | 'onChange'> & {
  value: number | '';
  setValue: (value: number | '') => void;
}) {
  return (
    <NumberInput
      {...props}
      value={value}
      onChange={(nextValue) => setValue(numberOrEmpty(nextValue))}
    />
  );
});

const MemoSelect = memo(function MemoSelect({
  value,
  setValue,
  ...props
}: Omit<ComponentProps<typeof Select>, 'value' | 'onChange'> & {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <Select
      {...props}
      value={value}
      onChange={(nextValue) => nextValue && setValue(nextValue)}
    />
  );
});

const MemoDateInput = memo(function MemoDateInput({
  value,
  setValue,
  ...props
}: Omit<ComponentProps<typeof DateInput>, 'value' | 'onChange'> & {
  value: DateValue | null;
  setValue: (value: DateValue | null) => void;
}) {
  return <DateInput {...props} value={value} onChange={setValue} />;
});

export default function TrainerRegistrationForm({ commonFields }: TrainerRegistrationFormProps) {
  const handlePhotoDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

    commonFields.setPhotoUrls([dataUrl]);
  };

  return (
    <>
      <MemoTextInput
        label="Фамилия"
        placeholder="Иванов"
        value={commonFields.lastName}
        setValue={commonFields.setLastName}
        required
        mt="md"
      />
      <MemoTextInput
        label="Имя"
        placeholder="Иван"
        value={commonFields.firstName}
        setValue={commonFields.setFirstName}
        required
        mt="md"
      />
      <MemoTextInput
        label="Отчество"
        placeholder="Иванович"
        value={commonFields.middleName}
        setValue={commonFields.setMiddleName}
        mt="md"
      />

      <MemoTextInput
        label="Электронная почта"
        placeholder="your@email.com"
        value={commonFields.email}
        setValue={commonFields.setEmail}
        required
        mt="md"
      />

      <MemoPasswordInput
        label="Пароль"
        placeholder="Введите пароль"
        value={commonFields.password}
        setValue={commonFields.setPassword}
        required
        mt="md"
      />

      <MemoPasswordInput
        label="Подтверждение пароля"
        placeholder="Повторите пароль"
        value={commonFields.confirmPassword}
        setValue={commonFields.setConfirmPassword}
        required
        mt="md"
      />

      <MemoSelect
        label="Пол"
        placeholder="Выберите пол"
        data={['Мужской', 'Женский']}
        value={commonFields.gender}
        setValue={commonFields.setGender}
        required
        mt="md"
      />

      <MemoNumberInput
        label="Рост (см)"
        placeholder="175"
        value={commonFields.height}
        setValue={commonFields.setHeight}
        min={50}
        max={300}
        mt="md"
      />

      <MemoNumberInput
        label="Вес (кг)"
        placeholder="70"
        value={commonFields.weight}
        setValue={commonFields.setWeight}
        min={1}
        max={500}
        mt="md"
      />

      <MemoTextInput
        label="Номер телефона"
        placeholder="+7 (XXX) XXX-XXXX"
        value={commonFields.phone}
        setValue={commonFields.setPhone}
        required
        mt="md"
      />

      <Divider my="sm" />

      <MemoDateInput
        label="Дата рождения"
        placeholder="Выберите дату"
        value={commonFields.birthDate}
        setValue={commonFields.setBirthDate}
        mt="md"
      />

      <MemoTextarea
        label="Образование"
        placeholder="Введите информацию об образовании"
        value={commonFields.education}
        setValue={commonFields.setEducation}
        mt="md"
      />

      <MemoTextInput
        label="Учебное заведение"
        placeholder="Название университета/колледжа"
        value={commonFields.institution}
        setValue={commonFields.setInstitution}
        mt="md"
      />

      <MemoTextInput
        label="Степень"
        placeholder="Бакалавр, Магистр и т.д."
        value={commonFields.degree}
        setValue={commonFields.setDegree}
        mt="md"
      />

      <MemoTextInput
        label="Специальность"
        placeholder="Физическая культура, Спортивная медицина и т.д."
        value={commonFields.specialization}
        setValue={commonFields.setSpecialization}
        mt="md"
      />

      <Dropzone
        onDrop={handlePhotoDrop}
        onReject={() => {}}
        maxSize={3 * 1024 ** 2}
        accept={['image/*']}
        mt="md"
      >
        <DropzoneAccept>
          <div style={{ textAlign: 'center' }}>Перетащите файлы сюда или нажмите для выбора</div>
        </DropzoneAccept>
        <DropzoneReject>
          <div style={{ textAlign: 'center' }}>Этот файл не поддерживается</div>
        </DropzoneReject>
        <DropzoneIdle>
          <div style={{ textAlign: 'center' }}>Загрузите фото профиля</div>
        </DropzoneIdle>
      </Dropzone>
      {commonFields.photoUrls[0] && (
        <Group mt="sm" justify="space-between" align="center">
          <Group>
            <Avatar src={commonFields.photoUrls[0]} radius="xl" size="lg" />
            <Text size="sm">Фото профиля выбрано</Text>
          </Group>
          <Button
            variant="light"
            color="red"
            size="xs"
            onClick={() => commonFields.setPhotoUrls([])}
          >
            Удалить фото
          </Button>
        </Group>
      )}

      <MemoTextInput
        label="Номер сертификата тренера"
        placeholder="Введите номер сертификата"
        value={commonFields.certificateNumber}
        setValue={commonFields.setCertificateNumber}
        mt="md"
      />
    </>
  );
}
