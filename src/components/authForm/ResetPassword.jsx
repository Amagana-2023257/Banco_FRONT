// src/components/authForm/ResetPassword.jsx
import React, { useState } from 'react';
import { useResetPassword } from '../../shared/hooks/useResetPassword';
import { Input } from '../UI/Input';

export const ResetPassword = () => {
  const { resetPassword, isLoading } = useResetPassword();
  const [form, setForm] = useState({ email: '', code: '', newPassword: '' });
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const onChange = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  // Validación del email
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validación del código
  const validateCode = (code) => {
    if (code.length !== 6) {
      setCodeError('El código debe tener 6 dígitos.');
      return false;
    }
    setCodeError('');
    return true;
  };

  // Validación de la nueva contraseña
  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email) || !validateCode(form.code) || !validatePassword(form.newPassword)) return;
    await resetPassword(form.email, form.code, form.newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Restablecer Contraseña</h2>

      <Input
        field="email"
        label="Correo electrónico"
        type="email"
        value={form.email}
        onChangeHandler={onChange('email')}
        onBlurHandler={() => validateEmail(form.email)}
        showErrorMessage={emailError !== ''}
        validationMessage={emailError}
        className="mb-4"
      />

      <Input
        field="code"
        label="Código"
        type="text"
        value={form.code}
        onChangeHandler={onChange('code')}
        onBlurHandler={() => validateCode(form.code)}
        showErrorMessage={codeError !== ''}
        validationMessage={codeError}
        className="mb-4"
      />

      <Input
        field="newPassword"
        label="Nueva contraseña"
        type="password"
        value={form.newPassword}
        onChangeHandler={onChange('newPassword')}
        onBlurHandler={() => validatePassword(form.newPassword)}
        showErrorMessage={passwordError !== ''}
        validationMessage={passwordError}
        className="mb-6"
      />

      <button
        type="submit"
        disabled={isLoading || !form.email || !form.code || !form.newPassword || emailError || codeError || passwordError}
        className={`w-full py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${isLoading && 'cursor-wait'}`}
      >
        {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
      </button>
    </form>
  );
};
