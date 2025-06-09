// src/shared/validators.js

/**
 * Valida que el teléfono tenga exactamente 8 dígitos numéricos.
 * @param {string} val
 * @returns {boolean}
 */
export const validatePhone = (val) => /^\d{8}$/.test(val);

/** Mensaje de validación para teléfono */
export const validatePhoneMessage = 'El teléfono debe tener 8 dígitos numéricos.';
