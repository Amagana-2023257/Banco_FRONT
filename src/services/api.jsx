// src/services/api.jsx
import axios from 'axios';
import { logout } from '../shared/hooks/useLogout';

const apiClient = axios.create({
  baseURL: 'https://banco-api-six.vercel.app/Banca-Kinal/v1',
  timeout: 5000,
});

// ————————————————————————————————————
// 1) Interceptor de REQUEST: adjunta el JWT
// ————————————————————————————————————
apiClient.interceptors.request.use(
  (config) => {
    const stored = sessionStorage.getItem('userDetails');
    if (stored) {
      const { token } = JSON.parse(stored);
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ————————————————————————————————————
// 2) Interceptor de RESPONSE: manejar 401/403
// ————————————————————————————————————
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      logout();
    }
    return Promise.reject(err);
  }
);

const handleError = (e) => ({
  error: true,
  message: e.message || 'Error desconocido',
});

// ========================================
// Autenticación
// ========================================
export const register = async (data) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (e) {
    console.error('Error al registrar', e);
    return { error: true, message: 'Error al registrar' };
  }
};

export const login = async (data) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  } catch (e) {
    return handleError(e);
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/auth/request-password-reset', { email });
    return response.data;
  } catch (e) {
    return handleError(e);
  }
};

export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await apiClient.post('/auth/reset-password', { email, code, newPassword });
    return response.data;
  } catch (e) {
    return handleError(e);
  }
};

// ========================================
// Tipo de cambio
// ========================================
export const getExchangeRates = async () => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/GTQ');
    const data = response.data;
    if (!data || !data.rates || typeof data.date !== 'string') {
      console.error('getExchangeRates: datos incompletos', data);
      return { rates: [], timestamp: null };
    }
    const fixedCurrencies = [
      'USD','EUR','GBP','JPY','CAD','AUD','CHF','CNY','SEK','NZD',
      'MXN','SGD','HKD','NOK','KRW','INR','RUB','BRL','ZAR','TRY'
    ];
    const inverted = fixedCurrencies
      .map((currency) => {
        const rateGTQ = data.rates[currency];
        return { currency, rate: rateGTQ > 0 ? 1 / rateGTQ : null };
      })
      .filter((r) => typeof r.rate === 'number');
    return { rates: inverted, timestamp: data.date };
  } catch (e) {
    console.error('Error al obtener tipos de cambio:', e);
    return { rates: [], timestamp: null };
  }
};

// ========================================
// Usuarios
// ========================================

// Obtener todos los usuarios (ADMIN_GLOBAL, GERENTE_SUCURSAL)
export const getAllUsers = async () => {
  try {
    const { data } = await apiClient.get('/users/all');
    return data; // { success, users }
  } catch (e) {
    console.error('Error fetch all users:', e);
    return { success: false, message: e.message };
  }
};

// Obtener un usuario por ID
export const getUserById = async (id) => {
  try {
    const { data } = await apiClient.get(`/users/user/${id}`);
    return data; // { success, user }
  } catch (e) {
    console.error(`Error fetch user ${id}:`, e);
    return { success: false, message: e.message };
  }
};

// Actualizar usuario (ADMIN_GLOBAL, GERENTE_SUCURSAL)
export const updateUser = async (id, updatePayload) => {
  try {
    const { data } = await apiClient.put(
      `/users/update/${id}`,
      updatePayload
    );
    return data;
  } catch (e) {
    console.error(`Error update user ${id}:`, e);
    // Devolver también los errores de validación que venga en e.response.data
    if (e.response && e.response.data) {
      return e.response.data;
    }
    return { success: false, message: e.message };
  }
};


// Desactivar usuario (ADMIN_GLOBAL)
export const deactivateUser = async (id) => {
  try {
    const { data } = await apiClient.put(`/users/delete/${id}`);
    return data; // { success, message, user }
  } catch (e) {
    console.error(`Error deactivate user ${id}:`, e);
    return { success: false, message: e.message };
  }
};

// Actualizar mi perfil (cualquier usuario autenticado)
export const updateMe = async (updatePayload) => {
  try {
    const { data } = await apiClient.put('/users/me', updatePayload);
    return data; // { success, message, user }
  } catch (e) {
    console.error('Error al actualizar mi perfil:', e);
    return { success: false, message: e.message };
  }
};


// =============================
// Cuentas
// =============================

/**
 * Crea una nueva cuenta para un usuario (ADMIN_GLOBAL, GERENTE_SUCURSAL)
 * @param {{ userId: string, currency?: string }} data
 */
export const createAccount = async (data) => {
  try {
    const { data: response } = await apiClient.post('/accounts/create', data);
    return response; // { success, account }
  } catch (e) {
    console.error('Error al crear cuenta:', e);
    return handleError(e);
  }
};

/**
 * Obtiene todas las cuentas (ADMIN_GLOBAL, GERENTE_SUCURSAL)
 */
export const getAllAccounts = async () => {
  try {
    const { data } = await apiClient.get('/accounts/all');
    return data; // { success, accounts }
  } catch (e) {
    console.error('Error fetch all accounts:', e);
    return { success: false, message: e.message };
  }
};

/**
 * Obtiene una cuenta por ID (ADMIN_GLOBAL, GERENTE_SUCURSAL, CAJERO, CLIENTE)
 */
export const getAccountById = async (id) => {
  try {
    const { data } = await apiClient.get(`/accounts/${id}`);
    return data; // { success, account }
  } catch (e) {
    console.error(`Error fetch account ${id}:`, e);
    return { success: false, message: e.message };
  }
};

/**
 * Actualiza datos de la cuenta (moneda, estado) (ADMIN_GLOBAL, GERENTE_SUCURSAL)
 */
export const updateAccount = async (id, updatePayload) => {
  try {
    const { data } = await apiClient.put(`/accounts/update/${id}`, updatePayload);
    return data; // { success, account }
  } catch (e) {
    console.error(`Error update account ${id}:`, e);
    return e.response?.data || { success: false, message: e.message };
  }
};

/**
 * Desactiva una cuenta (soft delete) (ADMIN_GLOBAL)
 */
export const deactivateAccount = async (id) => {
  try {
    const { data } = await apiClient.put(`/accounts/delete/${id}`);
    return data; // { success, message, account }
  } catch (e) {
    console.error(`Error deactivate account ${id}:`, e);
    return { success: false, message: e.message };
  }
};


// =============================
// Transacciones
// =============================

/**
 * Obtiene todas las transacciones (ADMIN_GLOBAL, GERENTE_SUCURSAL, CAJERO)
 */
export const getAllTransactions = async () => {
  try {
    const { data } = await apiClient.get('/transactions/all');
    return data; // { success, transactions }
  } catch (e) {
    console.error('Error fetch all transactions:', e);
    return { success: false, message: e.message };
  }
};

/**
 * Obtiene una transacción por ID (ADMIN_GLOBAL, GERENTE_SUCURSAL, CAJERO)
 */
export const getTransactionById = async (id) => {
  try {
    const { data } = await apiClient.get(`/transactions/${id}`);
    return data; // { success, transaction }
  } catch (e) {
    console.error(`Error fetch transaction ${id}:`, e);
    return { success: false, message: e.message };
  }
};

/**
 * Realiza un depósito (CAJERO, CLIENTE)
 * @param {{ accountId: string, amount: number }} data
 */
export const deposit = async (data) => {
  try {
    const { data: response } = await apiClient.post('/transactions/deposit', data);
    return response; // { success, transaction, balance }
  } catch (e) {
    console.error('Error al depositar:', e);
    return handleError(e);
  }
};

/**
 * Realiza una transferencia (CLIENTE)
 * @param {{ fromAccountId: string, toAccountId: string, amount: number }} data
 */
export const transfer = async (data) => {
  try {
    const { data: response } = await apiClient.post('/transactions/transfer', data);
    return response; // { success, transactions, balances }
  } catch (e) {
    console.error('Error al transferir:', e);
    return handleError(e);
  }
};

/**
 * Registra una compra (CLIENTE)
 * @param {{ accountId: string, amount: number }} data
 */
export const purchase = async (data) => {
  try {
    const { data: response } = await apiClient.post('/transactions/purchase', data);
    return response; // { success, transaction, balance }
  } catch (e) {
    console.error('Error en compra:', e);
    return handleError(e);
  }
};

/**
 * Aplica un crédito (CAJERO)
 * @param {{ accountId: string, amount: number }} data
 */
export const credit = async (data) => {
  try {
    const { data: response } = await apiClient.post('/transactions/credit', data);
    return response; // { success, transaction, balance }
  } catch (e) {
    console.error('Error en crédito:', e);
    return handleError(e);
  }
};

/**
 * Actualiza una transacción (ADMIN_GLOBAL, GERENTE_SUCURSAL)
 */
export const updateTransaction = async (id, updatePayload) => {
  try {
    const { data } = await apiClient.put(`/transactions/update/${id}`, updatePayload);
    return data; // { success, transaction }
  } catch (e) {
    console.error(`Error update transaction ${id}:`, e);
    return e.response?.data || { success: false, message: e.message };
  }
};

/**
 * Elimina una transacción (borrado físico) (ADMIN_GLOBAL)
 */
export const deleteTransaction = async (id) => {
  try {
    const { data } = await apiClient.delete(`/transactions/delete/${id}`);
    return data; // { success, message, transaction }
  } catch (e) {
    console.error(`Error delete transaction ${id}:`, e);
    return { success: false, message: e.message };
  }
};
