export const currency = (n) => `Q${Number(n || 0).toFixed(2)}`;

export const normalizeId = (u) => {
  if (!u) return "";
  if (typeof u === "string") return u;
  return u._id || u.id || "";
};

export const isClientRole = (role) =>
  role === "CLIENT" || role === "CLIENTE";

/** Si el backend no trae tipo, inferimos algo genérico */
export const guessType = (acct = {}) =>
  acct.type || (acct.currency === "GTQ" ? "Monetaria" : "Cuenta");
