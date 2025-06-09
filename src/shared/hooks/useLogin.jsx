// src/shared/hooks/useLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await loginRequest({ email, password });

      if (result.success) {
        const { token, user } = result.userDetails;

        sessionStorage.setItem(
          "userDetails",
          JSON.stringify({ token, user })
        );

        toast.success(result.message || "Inicio de sesión exitoso");
        navigate("/dashboard");
        return user;
      } else {
        toast.error(result.message || "Credenciales inválidas");
        return null;
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Error de red");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("userDetails");
    navigate("/login");
    toast.success("Has cerrado sesión con éxito");
  };

  return {
    login,
    logout,
    isLoading,
  };
};
