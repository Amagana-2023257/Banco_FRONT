import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Hook para manejar los detalles del usuario en la sesión
export const useUserDetails = () => {
  const navigate = useNavigate();

  // Inicializar el estado leyendo sessionStorage SÍNCRONAMENTE
  const [userDetails, setUserDetails] = useState(() => {
    try {
      const stored = sessionStorage.getItem("userDetails");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Función para cerrar sesión
  const logout = useCallback(() => {
    sessionStorage.removeItem("userDetails");
    setUserDetails(null);
    navigate("/auth/login");
  }, [navigate]);

  const user = userDetails?.user ?? {};

  return {
    isLogged: Boolean(userDetails?.token),
    id: user.id || null,
    name: user.name || null,
    surname: user.surname || null,
    username: user.username || "Invitado",
    email: user.email || null,
    role: user.role || null,
    token: userDetails?.token || null,
    logout,
  };
};
