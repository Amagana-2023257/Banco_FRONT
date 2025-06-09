// src/components/authForm/Login.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../UI/Input';
import {
  validateEmail,
  validatePassword,
  validateEmailMessage,
  validatePasswordMessage,
} from '../../shared/validators';
import { useLogin } from '../../shared/hooks';

export const Login = ({ switchAuthHandler, onForgotPassword }) => {
  const { login, isLoading } = useLogin();
  const [form, setForm] = useState({
    email: { value: '', isValid: false, showError: false },
    password: { value: '', isValid: false, showError: false },
  });

  const handleChange = (val, field) => {
    setForm(prev => ({ ...prev, [field]: { ...prev[field], value: val } }));
  };

  const handleBlur = (val, field) => {
    const isValid = field === 'email' ? validateEmail(val) : validatePassword(val);
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], isValid, showError: !isValid },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form.email.value.trim(), form.password.value);
  };

  const disabled = isLoading || !form.email.isValid || !form.password.isValid;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Input
          field="email"
          label="Correo Electrónico"
          type="email"
          value={form.email.value}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          showErrorMessage={form.email.showError}
          validationMessage={validateEmailMessage}
          inputClass="form-control"
        />
      </div>

      <div className="mb-3">
        <Input
          field="password"
          label="Contraseña"
          type="password"
          value={form.password.value}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          showErrorMessage={form.password.showError}
          validationMessage={validatePasswordMessage}
          inputClass="form-control"
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className={`btn btn-primary w-100${disabled ? ' disabled' : ''}`}
      >
        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button type="button" className="btn btn-link p-0" onClick={onForgotPassword}>
          ¿Olvidaste la contraseña?
        </button>
        <button type="button" className="btn btn-link p-0" onClick={switchAuthHandler}>
          Regístrate
        </button>
      </div>
    </form>
  );
};

Login.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
  onForgotPassword: PropTypes.func.isRequired,
};
