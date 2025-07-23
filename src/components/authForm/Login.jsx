// ===============================
// src/components/authForm/Login.jsx (Lavado de cara)
// ===============================
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "../UI/Input";
import {
  validateEmail,
  validatePassword,
  validateEmailMessage,
  validatePasswordMessage,
} from "../../shared/validators";
import { useLogin } from "../../shared/hooks";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const fieldFade = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
};

export const Login = ({ switchAuthHandler, onForgotPassword }) => {
  const { login, isLoading } = useLogin();
  const [form, setForm] = useState({
    email: { value: "", isValid: false, showError: false },
    password: { value: "", isValid: false, showError: false },
  });

  const handleChange = (val, field) => {
    setForm((prev) => ({ ...prev, [field]: { ...prev[field], value: val } }));
  };

  const handleBlur = (val, field) => {
    const isValid = field === "email" ? validateEmail(val) : validatePassword(val);
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], isValid, showError: !isValid },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email.value.trim(), form.password.value);
      toast.success("¡Bienvenido de nuevo!");
    } catch (err) {
      toast.error(err?.message || "Error al iniciar sesión");
    }
  };

  const disabled = isLoading || !form.email.isValid || !form.password.isValid;

  return (
    <motion.form onSubmit={handleSubmit} initial="hidden" animate="visible" variants={{}}>
      <motion.div className="mb-3" variants={fieldFade} custom={0}>
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
          aria-required="true"
        />
      </motion.div>

      <motion.div className="mb-3" variants={fieldFade} custom={1}>
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
          autoComplete="current-password"
          aria-required="true"
        />
      </motion.div>

      <motion.button
        type="submit"
        disabled={disabled}
        className="btn btn-primary w-100"
        variants={fieldFade}
        custom={2}
      >
        {isLoading ? "Cargando..." : "Iniciar Sesión"}
      </motion.button>

      <motion.div
        className="d-flex justify-content-between align-items-center mt-3"
        variants={fieldFade}
        custom={3}
      >
      </motion.div>
    </motion.form>
  );
};

Login.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
  onForgotPassword: PropTypes.func.isRequired,
};
