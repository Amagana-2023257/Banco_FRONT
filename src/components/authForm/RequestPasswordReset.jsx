// src/components/authForm/RequestPasswordReset.jsx
import React, { useState } from 'react';
import { useRequestPasswordReset } from '../../shared/hooks/useRequestPasswordReset';
import { Input } from '../UI/Input';
import PropTypes from 'prop-types';

export const RequestPasswordReset = ({ onNext }) => {
  const { requestPasswordReset, isLoading } = useRequestPasswordReset();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Validar email
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;  // Si el email no es válido, no enviamos el formulario
    const res = await requestPasswordReset(email);
    if (res.success) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Recuperar Contraseña</h2>
      
      <Input
        field="email"
        label="Correo electrónico"
        type="email"
        value={email}
        onChangeHandler={setEmail}
        onBlurHandler={() => validateEmail(email)}
        showErrorMessage={emailError !== ''}
        validationMessage={emailError}
        className="mb-4"
      />

      <button
        type="submit"
        disabled={isLoading || !email || emailError}
        className={`w-full py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${isLoading && 'cursor-wait'}`}
      >
        {isLoading ? 'Enviando...' : 'Enviar Código'}
      </button>
    </form>
  );
};

RequestPasswordReset.propTypes = {
  onNext: PropTypes.func.isRequired,
};
