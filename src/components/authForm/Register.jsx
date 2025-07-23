import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "../UI/Input";
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
} from "../../shared/validators";
import { useRegister } from "../../shared/hooks/useRegister";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const fieldFade = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04 } }),
};

export const Register = ({ switchAuthHandler }) => {
  const { register: doRegister, isLoading } = useRegister();
  const [form, setForm] = useState({
    name: { value: "", isValid: false, showError: false },
    surname: { value: "", isValid: false, showError: false },
    username: { value: "", isValid: false, showError: false },
    email: { value: "", isValid: false, showError: false },
    phone: { value: "", isValid: false, showError: false },
    password: { value: "", isValid: false, showError: false },
    passwordConf: { value: "", isValid: false, showError: false },
    dpi: { value: "", isValid: false, showError: false },
    address: { value: "", isValid: false, showError: false },
    jobName: { value: "", isValid: false, showError: false },
    monthlyIncome: { value: "", isValid: false, showError: false },
  });

  const handleChange = (val, field) =>
    setForm((prev) => ({ ...prev, [field]: { ...prev[field], value: val } }));

  const handleBlur = (val, field) => {
    let valid = false;
    switch (field) {
      case "name":
      case "surname":
        valid = val.trim().length > 0 && /^[A-Za-zÁÉÍÓÚáéíóúñÑ' ]+$/.test(val);
        break;
      case "username":
        valid = validateUsername(val);
        break;
      case "email":
        valid = validateEmail(val);
        break;
      case "phone":
        valid = validatePhone(val);
        break;
      case "password":
        valid = validatePassword(val) && /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val);
        break;
      case "passwordConf":
        valid = validatePasswordConfirm(form.password.value, val);
        break;
      case "dpi":
        valid = /^\d{13}$/.test(val);
        break;
      case "address":
      case "jobName":
        valid = val.trim().length > 0;
        break;
      case "monthlyIncome":
        valid = Number(val) > 100;
        break;
      default:
        valid = true;
    }
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], isValid: valid, showError: !valid },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doRegister({
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
      toast.success("Cuenta creada. Revisa tu correo para activarla.");
    } catch (err) {
      toast.error(err?.message || "Error al registrar");
    }
  };

  const allValid = Object.values(form).every((f) => f.isValid);
  const disabled = !allValid || isLoading;

  return (
    <motion.form onSubmit={handleSubmit} initial="hidden" animate="visible" variants={{}}>
      <div className="row g-3">
        <motion.div className="col-12 col-md-6" variants={fieldFade} custom={0}>
          <Input
            field="name"
            label="Nombre"
            type="text"
            value={form.name.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.name.showError}
            validationMessage="El nombre es obligatorio y solo letras."
            inputClass="form-control"
            autoComplete="given-name"
          />
        </motion.div>
        <motion.div className="col-12 col-md-6" variants={fieldFade} custom={1}>
          <Input
            field="surname"
            label="Apellido"
            type="text"
            value={form.surname.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.surname.showError}
            validationMessage="El apellido es obligatorio y solo letras."
            inputClass="form-control"
            autoComplete="family-name"
          />
        </motion.div>
      </div>

      <motion.div className="mt-3" variants={fieldFade} custom={2}>
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
          autoComplete="username"
        />
      </motion.div>

      <motion.div className="mt-3" variants={fieldFade} custom={3}>
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
          autoComplete="email"
        />
      </motion.div>

      <motion.div className="mt-3" variants={fieldFade} custom={4}>
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
          autoComplete="tel"
        />
      </motion.div>

      <div className="row g-3 mt-3">
        <motion.div className="col-12 col-md-6" variants={fieldFade} custom={5}>
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
            autoComplete="new-password"
          />
          <PasswordHints value={form.password.value} />
        </motion.div>
        <motion.div className="col-12 col-md-6" variants={fieldFade} custom={6}>
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
            autoComplete="new-password"
          />
        </motion.div>
      </div>

      <div className="row g-3 mt-3">
        <motion.div className="col-12 col-md-6" variants={fieldFade} custom={7}>
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
            inputMode="numeric"
          />
        </motion.div>
        <motion.div className="col-12 col-md-6" variants={fieldFade} custom={8}>
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
            autoComplete="street-address"
          />
        </motion.div>
      </div>

      <div className="row g-3 mt-3">
        <motion.div className="col-12 col-md-6" variants={fieldFade} custom={9}>
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
        </motion.div>
        <motion.div className="col-12 col-md-6" variants={fieldFade} custom={10}>
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
            inputMode="decimal"
          />
        </motion.div>
      </div>

      <motion.button
        type="submit"
        disabled={disabled}
        className="btn btn-primary w-100 mt-4"
        variants={fieldFade}
        custom={11}
      >
        {isLoading ? "Registrando..." : "Crear Cuenta"}
      </motion.button>
    </motion.form>
  );
};

Register.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};

// Indicador de fuerza de contraseña (simple)
const PasswordHints = ({ value }) => {
  const rules = [
    { label: "8+ caracteres", test: (v) => v.length >= 8 },
    { label: "Una mayúscula", test: (v) => /[A-Z]/.test(v) },
    { label: "Un número", test: (v) => /\d/.test(v) },
    { label: "Un carácter especial", test: (v) => /[^A-Za-z0-9]/.test(v) },
  ];
  return (
    <ul className="password-hints small mt-2">
      {rules.map((r) => (
        <li key={r.label} className={r.test(value) ? "ok" : "nok"}>
          <i className={r.test(value) ? "bi bi-check-circle-fill me-1" : "bi bi-dot me-1"}></i>
          {r.label}
        </li>
      ))}
    </ul>
  );
};