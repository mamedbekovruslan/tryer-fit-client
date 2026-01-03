import {
  TextInput,
  PasswordInput,
  Select,
  NumberInput,
  Divider,
  Textarea,
  Title,
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
    // Поля профиля клиента
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

export default function ClientRegistrationForm({ commonFields }: ClientRegistrationFormProps) {
  const handlePhotoUpload = (files: File[]) => {
    // Convert files to URLs for preview - in a real app you would upload these to a server
    const urls = files.map(file => URL.createObjectURL(file));
    commonFields.setPhotoUrls([...commonFields.photoUrls, ...urls]);
  };

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

      <Divider my="sm" />
      <Title order={4} mt="md">Дополнительная информация</Title>

      {/* Обхваты */}
      <NumberInput
        label="Обхват талии (см)"
        placeholder="Введите значение"
        value={commonFields.waistCircumference}
        onChange={commonFields.setWaistCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <NumberInput
        label="Обхват груди (см)"
        placeholder="Введите значение"
        value={commonFields.chestCircumference}
        onChange={commonFields.setChestCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <NumberInput
        label="Обхват бедер (см)"
        placeholder="Введите значение"
        value={commonFields.hipCircumference}
        onChange={commonFields.setHipCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <NumberInput
        label="Обхват руки (см)"
        placeholder="Введите значение"
        value={commonFields.armCircumference}
        onChange={commonFields.setArmCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      <NumberInput
        label="Обхват ноги (см)"
        placeholder="Введите значение"
        value={commonFields.legCircumference}
        onChange={commonFields.setLegCircumference}
        min={0}
        max={300}
        step={0.1}
        mt="md"
      />

      {/* Цель и ожидаемый результат */}
      <Select
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
        onChange={(value) => value && commonFields.setFitnessGoal(value)}
        mt="md"
      />

      <Textarea
        label="Какой результат вы ожидаете увидеть?"
        placeholder="Опишите свои цели и ожидания..."
        value={commonFields.expectedResult}
        onChange={(e) => commonFields.setExpectedResult(e.currentTarget.value)}
        minRows={3}
        mt="md"
      />

      {/* Противопоказания и заболевания */}
      <Textarea
        label="Противопоказания"
        placeholder="Укажите возможные противопоказания..."
        value={commonFields.contraindications}
        onChange={(e) => commonFields.setContraindications(e.currentTarget.value)}
        minRows={2}
        mt="md"
      />

      <Textarea
        label="Заболевания"
        placeholder="Укажите имеющиеся заболевания..."
        value={commonFields.diseases}
        onChange={(e) => commonFields.setDiseases(e.currentTarget.value)}
        minRows={2}
        mt="md"
      />

      <Textarea
        label="Ограничения"
        placeholder="Укажите физические ограничения..."
        value={commonFields.limitations}
        onChange={(e) => commonFields.setLimitations(e.currentTarget.value)}
        minRows={2}
        mt="md"
      />

      {/* Опыт и рацион */}
      <Textarea
        label="Опыт тренировок"
        placeholder="Расскажите о вашем опыте тренировок..."
        value={commonFields.trainingExperience}
        onChange={(e) => commonFields.setTrainingExperience(e.currentTarget.value)}
        minRows={3}
        mt="md"
      />

      <Textarea
        label="Текущий рацион питания"
        placeholder="Опишите ваш текущий рацион..."
        value={commonFields.currentDiet}
        onChange={(e) => commonFields.setCurrentDiet(e.currentTarget.value)}
        minRows={3}
        mt="md"
      />

      {/* Загрузка фотографий */}
      <div>
        <Text size="sm" mb="xs" mt="md">Фотографии (спереди, сбоку, сзади)</Text>
        <Dropzone
          onDrop={handlePhotoUpload}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={3 * 1024 ** 2} // 3MB
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
                Перетащите сюда изображения или нажмите для выбора
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Загрузите фотографии в полный рост: спереди, сбоку и сзади. Максимальный размер файла: 3 мб.
              </Text>
            </div>
          </Group>
        </Dropzone>
      </div>
    </>
  );
}