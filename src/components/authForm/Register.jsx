// src/components/authForm/Register.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../UI/Input';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validatePasswordConfirm,
  validateEmailMessage,
  validateUsernameMessage,
  validatePasswordMessage,
  validatePhoneMessage,
  validatePasswordConfirmMessage,
} from '../../shared/validators';
import { useRegister } from '../../shared/hooks/useRegister';

export const Register = ({ switchAuthHandler }) => {
  const { register, isLoading } = useRegister();
  const [form, setForm] = useState({
    name: { value: '', isValid: false, showError: false },
    surname: { value: '', isValid: false, showError: false },
    username: { value: '', isValid: false, showError: false },
    email: { value: '', isValid: false, showError: false },
    phone: { value: '', isValid: false, showError: false },
    password: { value: '', isValid: false, showError: false },
    passwordConf: { value: '', isValid: false, showError: false },
    dpi: { value: '', isValid: false, showError: false },
    address: { value: '', isValid: false, showError: false },
    jobName: { value: '', isValid: false, showError: false },
    monthlyIncome: { value: '', isValid: false, showError: false },
  });

  const handleChange = (val, field) =>
    setForm(prev => ({ ...prev, [field]: { ...prev[field], value: val } }));

  const handleBlur = (val, field) => {
    let valid = false;
    switch (field) {
      case 'name':
      case 'surname':
        valid = val.trim().length > 0;
        break;
      case 'username':
        valid = validateUsername(val);
        break;
      case 'email':
        valid = validateEmail(val);
        break;
      case 'phone':
        valid = validatePhone(val);
        break;
      case 'password':
        valid = validatePassword(val);
        break;
      case 'passwordConf':
        valid = validatePasswordConfirm(form.password.value, val);
        break;
      case 'dpi':
        valid = /^\d{13}$/.test(val);
        break;
      case 'address':
      case 'jobName':
        valid = val.trim().length > 0;
        break;
      case 'monthlyIncome':
        valid = Number(val) > 100;
        break;
      default:
        valid = true;
    }
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], isValid: valid, showError: !valid },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register({
      name: form.name.value.trim(),
      surname: form.surname.value.trim(),
      username: form.username.value.trim(),
      email: form.email.value.trim().toLowerCase(),
      phone: form.phone.value.trim(),
      password: form.password.value,
      dpi: form.dpi.value.trim(),
      address: form.address.value.trim(),
      jobName: form.jobName.value.trim(),
      monthlyIncome: Number(form.monthlyIncome.value),
    });
  };

  const allValid =
    form.name.isValid &&
    form.surname.isValid &&
    form.username.isValid &&
    form.email.isValid &&
    form.phone.isValid &&
    form.password.isValid &&
    form.passwordConf.isValid &&
    form.dpi.isValid &&
    form.address.isValid &&
    form.jobName.isValid &&
    form.monthlyIncome.isValid;

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <Input
            field="name"
            label="Nombre"
            type="text"
            value={form.name.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.name.showError}
            validationMessage="El nombre es obligatorio."
            inputClass="form-control"
          />
        </div>
        <div className="col-12 col-md-6">
          <Input
            field="surname"
            label="Apellido"
            type="text"
            value={form.surname.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.surname.showError}
            validationMessage="El apellido es obligatorio."
            inputClass="form-control"
          />
        </div>
      </div>

      <div className="mt-3">
        <Input
          field="username"
          label="Usuario"
          type="text"
          value={form.username.value}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          showErrorMessage={form.username.showError}
          validationMessage={validateUsernameMessage}
          inputClass="form-control"
        />
      </div>

      <div className="mt-3">
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

      <div className="mt-3">
        <Input
          field="phone"
          label="Teléfono"
          type="tel"
          value={form.phone.value}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          showErrorMessage={form.phone.showError}
          validationMessage={validatePhoneMessage}
          inputClass="form-control"
        />
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-md-6">
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
        <div className="col-12 col-md-6">
          <Input
            field="passwordConf"
            label="Confirmar Contraseña"
            type="password"
            value={form.passwordConf.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.passwordConf.showError}
            validationMessage={validatePasswordConfirmMessage}
            inputClass="form-control"
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-md-6">
          <Input
            field="dpi"
            label="DPI"
            type="text"
            value={form.dpi.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.dpi.showError}
            validationMessage="El DPI debe tener 13 dígitos."
            inputClass="form-control"
          />
        </div>
        <div className="col-12 col-md-6">
          <Input
            field="address"
            label="Dirección"
            type="text"
            value={form.address.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.address.showError}
            validationMessage="La dirección es obligatoria."
            inputClass="form-control"
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-md-6">
          <Input
            field="jobName"
            label="Trabajo"
            type="text"
            value={form.jobName.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.jobName.showError}
            validationMessage="El trabajo es requerido."
            inputClass="form-control"
          />
        </div>
        <div className="col-12 col-md-6">
          <Input
            field="monthlyIncome"
            label="Ingreso Mensual"
            type="number"
            min="100"
            value={form.monthlyIncome.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.monthlyIncome.showError}
            validationMessage="Debe ser mayor a Q100."
            inputClass="form-control"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!allValid || isLoading}
        className={`btn btn-primary w-100 mt-4${(!allValid || isLoading) ? ' disabled' : ''}`}
      >
        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
      </button>

     
    </form>
  );
};

Register.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};
