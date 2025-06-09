// src/shared/hooks/useRegister.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (formData) => {
    setIsLoading(true);

    try {
      const response = await registerRequest(formData);

      if (response && response.error) {
        const err = response.error;
        const payload = err.response?.data;

        if (Array.isArray(payload?.errors)) {
          payload.errors.forEach(({ message }) => {
            toast.error(message);
          });
        } else {
          toast.error(payload?.message || err.message || "Error al registrar");
        }
        return;
      }

      if (response && response.data) {
        toast.success(response.data.message || "Cuenta creada exitosamente");
        navigate("/auth");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error("Error inesperado: " + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
