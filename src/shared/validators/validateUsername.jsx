export const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{3,8}$/;
    return regex.test(username);
  };
  
  export const validateUsernameMessage = 'El nombre de usuario debe tener entre 3 y 8 caracteres, sin espacios ni caracteres especiales.';
  