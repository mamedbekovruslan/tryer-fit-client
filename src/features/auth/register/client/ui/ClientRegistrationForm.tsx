import { memo, type ComponentProps } from 'react';
import {
  TextInput,
  PasswordInput,
  Select,
  NumberInput,
  Divider,
  Textarea,
  Title,
  Avatar,
  Button,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { DateValue } from '@mantine/dates';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';
import { Group, Text } from '@mantine/core';

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
    waistCircumference: number | '';
    setWaistCircumference: (value: number | '') => void;
    chestCircumference: number | '';
    setChestCircumference: (value: number | '') => void;
    hipCircumference: number | '';
    setHipCircumference: (value: number | '') => void;
    armCircumference: number | '';
    setArmCircumference: (value: number | '') => void;
    legCircumference: number | '';
    setLegCircumference: (value: number | '') => void;
    fitnessGoal: string;
    setFitnessGoal: (value: string) => void;
    expectedResult: string;
    setExpectedResult: (value: string) => void;
    contraindications: string;
    setContraindications: (value: string) => void;
    diseases: string;
    setDiseases: (value: string) => void;
    limitations: string;
    setLimitations: (value: string) => void;
    trainingExperience: string;
    setTrainingExperience: (value: string) => void;
    currentDiet: string;
    setCurrentDiet: (value: string) => void;
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

export default function ClientRegistrationForm({ commonFields }: ClientRegistrationFormProps) {
  const handlePhotoUpload = async (files: File[]) => {
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

      <Divider my="sm" />
      <Title order={4} mt="md">Дополнительная информация</Title>

      <MemoNumberInput
        label="Обхват талии (см)"
        placeholder="Введите значение"
        value={commonFields.waistCircumference}
        setValue={commonFields.setWaistCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <MemoNumberInput
        label="Обхват груди (см)"
        placeholder="Введите значение"
        value={commonFields.chestCircumference}
        setValue={commonFields.setChestCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <MemoNumberInput
        label="Обхват бедер (см)"
        placeholder="Введите значение"
        value={commonFields.hipCircumference}
        setValue={commonFields.setHipCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <MemoNumberInput
        label="Обхват руки (см)"
        placeholder="Введите значение"
        value={commonFields.armCircumference}
        setValue={commonFields.setArmCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <MemoNumberInput
        label="Обхват ноги (см)"
        placeholder="Введите значение"
        value={commonFields.legCircumference}
        setValue={commonFields.setLegCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <MemoSelect
        label="Цель тренировок"
        placeholder="Выберите цель"
        data={[
          { value: 'weight_loss', label: 'Снижение веса' },
          { value: 'muscle_gain', label: 'Набор мышечной массы' },
          { value: 'endurance', label: 'Повышение выносливости' },
          { value: 'flexibility', label: 'Повышение гибкости' },
          { value: 'general_fitness', label: 'Общая физическая подготовка' },
        ]}
        value={commonFields.fitnessGoal}
        setValue={commonFields.setFitnessGoal}
        mt="md"
      />

      <MemoTextarea
        label="Какой результат вы ожидаете увидеть?"
        placeholder="Опишите свои цели и ожидания..."
        value={commonFields.expectedResult}
        setValue={commonFields.setExpectedResult}
        minRows={3}
        mt="md"
      />

      <MemoTextarea
        label="Противопоказания"
        placeholder="Укажите возможные противопоказания..."
        value={commonFields.contraindications}
        setValue={commonFields.setContraindications}
        minRows={2}
        mt="md"
      />

      <MemoTextarea
        label="Заболевания"
        placeholder="Укажите имеющиеся заболевания..."
        value={commonFields.diseases}
        setValue={commonFields.setDiseases}
        minRows={2}
        mt="md"
      />

      <MemoTextarea
        label="Ограничения"
        placeholder="Укажите физические ограничения..."
        value={commonFields.limitations}
        setValue={commonFields.setLimitations}
        minRows={2}
        mt="md"
      />

      <MemoTextarea
        label="Опыт тренировок"
        placeholder="Расскажите о вашем опыте тренировок..."
        value={commonFields.trainingExperience}
        setValue={commonFields.setTrainingExperience}
        minRows={3}
        mt="md"
      />

      <MemoTextarea
        label="Текущий рацион питания"
        placeholder="Опишите ваш текущий рацион..."
        value={commonFields.currentDiet}
        setValue={commonFields.setCurrentDiet}
        minRows={3}
        mt="md"
      />

      <div>
        <Text size="sm" mb="xs" mt="md">Фото профиля</Text>
        <Dropzone
          onDrop={handlePhotoUpload}
          onReject={() => {}}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <Group justify="center" gap="xl" mih={120}>
            <Dropzone.Accept>
              <FiUpload style={{ width: '3rem', height: '3rem' }} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <FiX style={{ width: '3rem', height: '3rem' }} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <FiImage style={{ width: '3rem', height: '3rem' }} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Перетащите сюда изображение или нажмите для выбора
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Загрузите фото профиля. Максимальный размер файла: 3 мб.
              </Text>
            </div>
          </Group>
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
      </div>
    </>
  );
}
