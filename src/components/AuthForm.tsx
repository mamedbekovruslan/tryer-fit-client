'use client';

import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Text,
  Anchor,
  Group,
  Select,
  NumberInput,
  Divider,
  Textarea,
  Tabs
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Dropzone } from '@mantine/dropzone';
import { DropzoneAccept, DropzoneReject, DropzoneIdle } from '@mantine/dropzone';
import { IoIosArrowBack } from 'react-icons/io';

export default function AuthForm() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [userType, setUserType] = useState<'client' | 'trainer'>('client');

  if (isLoginForm) {
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <TextInput
          label="Электронная почта"
          placeholder="your@email.com"
          required
        />
        
        <PasswordInput
          label="Пароль"
          placeholder="Ваш пароль"
          required
          mt="md"
        />
        
        <Group justify="space-between" mt="lg">
          <Anchor component="button" type="button" c="dimmed" size="sm">
            Забыли пароль?
          </Anchor>
        </Group>
        
        <Button fullWidth mt="xl" type="submit">
          Войти
        </Button>
        
        <Text ta="center" mt="md">
          Нет аккаунта?{' '}
          <Anchor
            component="button"
            type="button"
            fw={500}
            onClick={() => setIsLoginForm(false)}
          >
            Зарегистрироваться
          </Anchor>
        </Text>
      </form>
    );
  } else {
    return (
      <form onSubmit={(e) => e.preventDefault()} style={{ position: 'relative' }}>
        <div style={{ marginBottom: "1rem", position: "absolute", top: "-54px", left: "-11px" }}>
          <button
            type="button"
            onClick={() => setIsLoginForm(true)}
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
          </button>
        </div>

        <Tabs value={userType} onChange={(value: string | null) => value && setUserType(value as 'client' | 'trainer')} mb="md">
          <Tabs.List>
            <Tabs.Tab value="client">Клиент</Tabs.Tab>
            <Tabs.Tab value="trainer">Тренер</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Divider my="sm" />

        <TextInput
          label="Фамилия"
          placeholder="Иванов"
          required
          mt="md"
        />
        <TextInput
          label="Имя"
          placeholder="Иван"
          required
          mt="md"
        />
        <TextInput
          label="Отчество"
          placeholder="Иванович"
          mt="md"
        />

        <TextInput
          label="Электронная почта"
          placeholder="your@email.com"
          required
          mt="md"
        />

        <PasswordInput
          label="Пароль"
          placeholder="Введите пароль"
          required
          mt="md"
        />

        <PasswordInput
          label="Подтверждение пароля"
          placeholder="Повторите пароль"
          required
          mt="md"
        />

        <Select
          label="Пол"
          placeholder="Выберите пол"
          data={['Мужской', 'Женский']}
          required
          mt="md"
        />

        <NumberInput
          label="Рост (см)"
          placeholder="175"
          min={50}
          max={300}
          mt="md"
        />

        <NumberInput
          label="Вес (кг)"
          placeholder="70"
          min={1}
          max={500}
          mt="md"
        />

        <TextInput
          label="Номер телефона"
          placeholder="+7 (XXX) XXX-XXXX"
          required
          mt="md"
        />

        {userType === 'client' && (
          <>
            <DateInput
              label="Дата рождения"
              placeholder="Выберите дату"
              mt="md"
            />
          </>
        )}

        {userType === 'trainer' && (
          <>
            <DateInput
              label="Дата рождения"
              placeholder="Выберите дату"
              mt="md"
            />

            <Textarea
              label="Образование"
              placeholder="Введите информацию об образовании"
              mt="md"
            />

            <TextInput
              label="Учебное заведение"
              placeholder="Название университета/колледжа"
              mt="md"
            />

            <TextInput
              label="Степень"
              placeholder="Бакалавр, Магистр и т.д."
              mt="md"
            />

            <TextInput
              label="Специальность"
              placeholder="Физическая культура, Спортивная медицина и т.д."
              mt="md"
            />

            <Dropzone
              onDrop={(files) => console.log('Dropped files:', files)}
              onReject={(files) => console.log('Rejected files:', files)}
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

            <TextInput
              label="Номер сертификата тренера"
              placeholder="Введите номер сертификата"
              mt="md"
            />
          </>
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
            onClick={() => setIsLoginForm(true)}
          >
            Войти
          </Anchor>
        </Text>
      </form>
    );
  }
}