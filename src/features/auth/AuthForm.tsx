'use client';

import { useState } from 'react';
import LoginForm from './components/LoginForm';
import { default as RegisterForm } from '@/features/auth/components/RegisterForm';

export default function AuthForm() {
  const [isLoginForm, setIsLoginForm] = useState(true);

  return isLoginForm ? (
    <LoginForm onSwitchToRegister={() => setIsLoginForm(false)} />
  ) : (
    <RegisterForm onSwitchToLogin={() => setIsLoginForm(true)} />
  );
}