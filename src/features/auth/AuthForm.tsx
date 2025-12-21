'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthForm() {
  const [isLoginForm, setIsLoginForm] = useState(true);

  return isLoginForm ? (
    <LoginForm onSwitchToRegister={() => setIsLoginForm(false)} />
  ) : (
    <RegisterForm onSwitchToLogin={() => setIsLoginForm(true)} />
  );
}