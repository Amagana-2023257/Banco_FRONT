// src/components/transaction/TransferForm.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Form, Modal, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

import { useTransfer } from "../../shared/hooks/useTransfer";
import { useGetAllAccounts } from "../../shared/hooks/useGetAllAccounts";
import { useUserDetails } from "../../shared/hooks/useUserDetails";

import "./TransferForm.css";

/* ---------- Constantes visuales ---------- */
const HERO_IMG =
  "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=1600&q=80";
const LOGO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/5/50/Bank_font_awesome.svg";

/* ---------- Animaciones ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" },
  }),
};

/* ---------- Helpers ---------- */
const buildFingerprint = (id) =>
  btoa(`${id || "tmp"}-${Date.now()}-${Math.random()}`).slice(0, 22);

const currency = (n) => `Q${Number(n || 0).toFixed(2)}`;

const normalizeId = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val._id || val.id || "";
  return "";
};

const isClientRole = (r) => /CLIENTE?/i.test(r || "");

/* ---------- Componente principal ---------- */
export const TransferForm = () => {
  const {
    transfer,
    transactions,
    balances,
    isLoading: isTransferring,
    error: transferError,
  } = useTransfer();

  const {
    accounts,
    getAllAccounts,
    isLoading: loadingAccounts,
    error: accountsError,
  } = useGetAllAccounts();

  const { role, id: userId } = useUserDetails();
  const myId = String(userId || "");

  const [form, setForm] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    concept: "",
    notes: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [authWord, setAuthWord] = useState("");
  const [savingReceipt, setSavingReceipt] = useState(false);
  const [fingerprint, setFingerprint] = useState("");

  const receiptRef = useRef(null);

  /* Cargar cuentas */
  useEffect(() => {
    getAllAccounts();
  }, [getAllAccounts]);

  /* Última transacción */
  const tx = useMemo(() => {
    if (!transactions) return null;
    return Array.isArray(transactions)
      ? transactions[transactions.length - 1]
      : transactions;
  }, [transactions]);

  /* Fingerprint tras éxito */
  useEffect(() => {
    if (tx && !fingerprint) {
      setFingerprint(buildFingerprint(tx.id));
    }
  }, [tx, fingerprint]);

  /* Filtrar cuentas propias si es CLIENTE */
  const ownAccounts = useMemo(() => {
    if (!accounts) return [];
    if (!isClientRole(role)) return accounts;
    return accounts.filter(
      (a) => normalizeId(a.user) === myId && a.status !== false
    );
  }, [accounts, role, myId]);

  /* Autoseleccionar primera cuenta propia */
  useEffect(() => {
    if (!form.fromAccountId && ownAccounts.length > 0) {
      setForm((p) => ({ ...p, fromAccountId: ownAccounts[0].id }));
    }
  }, [ownAccounts, form.fromAccountId]);

  /* Validaciones */
  const errors = useMemo(() => {
    const e = {};
    const amountNum = Number(form.amount);

    // fromAccountId
    if (!form.fromAccountId) e.fromAccountId = "Selecciona la cuenta origen.";
    else if (
      isClientRole(role) &&
      !ownAccounts.some((a) => a.id === form.fromAccountId)
    ) {
      e.fromAccountId = "No puedes usar esa cuenta como origen.";
    }

    // toAccountId
    if (!form.toAccountId) e.toAccountId = "Selecciona la cuenta destino.";
    if (
      form.fromAccountId &&
      form.toAccountId &&
      form.fromAccountId === form.toAccountId
    ) {
      e.toAccountId = "La cuenta de destino debe ser distinta a la de origen.";
    }

    // amount
    if (!form.amount) e.amount = "El monto es obligatorio.";
    else if (isNaN(amountNum)) e.amount = "Monto inválido.";
    else if (amountNum <= 0) e.amount = "Debe ser mayor a 0.";
    else if (amountNum < 1) e.amount = "Transferencia mínima: Q1.00.";
    else if (amountNum > 1_000_000) e.amount = "Excede el máximo permitido.";

    // saldo
    const fromAcct = accounts?.find((a) => a.id === form.fromAccountId);
    if (fromAcct && amountNum > fromAcct.balance) {
      e.amount = "Saldo insuficiente en la cuenta origen.";
    }

    // concepto / notas
    if (!form.concept.trim()) e.concept = "Indica el motivo de la transferencia.";
    else if (form.concept.trim().length < 3) e.concept = "Muy corto.";
    else if (form.concept.trim().length > 120) e.concept = "Máximo 120 caracteres.";

    if (form.notes.trim().length > 250) e.notes = "Máximo 250 caracteres.";

    return e;
  }, [form, accounts, role, ownAccounts]);

  const isImmediate = useMemo(() => Number(form.amount) < 2000, [form.amount]);
  const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  /* Handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => {
      // limpiar destino si coincide con origen
      if (name === "fromAccountId" && value === p.toAccountId) {
        return { ...p, [name]: value, toAccountId: "" };
      }
      return { ...p, [name]: value };
    });
  };

  const openConfirm = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Revisa los campos marcados.");
      return;
    }
    setAcceptTerms(false);
    setAuthWord("");
    setShowConfirm(true);
  };

  const doConfirm = async () => {
    // Seguridad adicional
    if (
      isClientRole(role) &&
      !ownAccounts.some((a) => a.id === form.fromAccountId)
    ) {
      toast.error("No puedes transferir desde esta cuenta.");
      return;
    }

    if (authWord.toUpperCase() !== "CONFIRMAR") {
      toast.error('Escribe "CONFIRMAR" en mayúsculas para autorizar.');
      return;
    }
    if (!acceptTerms) {
      toast.error("Debes aceptar los términos.");
      return;
    }
    setShowConfirm(false);

    await transfer({
      fromAccountId: form.fromAccountId,
      toAccountId: form.toAccountId,
      amount: Number(form.amount),
      concept: form.concept.trim(),
      notes: form.notes.trim(),
    });

    if (!transferError) {
      toast.success("Transferencia realizada.");
    }
  };

  const saveReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      setSavingReceipt(true);
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `comprobante-transferencia-${tx?.id || Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo generar el comprobante.");
    } finally {
      setSavingReceipt(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" className="transfer-container">
      {/* HERO */}
      <motion.div className="transfer-hero" variants={fadeUp}>
        <div
          className="transfer-hero__bg"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
          aria-hidden="true"
        />
        <div className="transfer-hero__overlay" aria-hidden="true" />
        <div className="transfer-hero__content text-center text-white">
          <motion.h1 className="display-6 fw-bold mb-2" variants={fadeUp} custom={0}>
            Transferencias
          </motion.h1>
          <motion.p className="small mb-0" variants={fadeUp} custom={1}>
            Estás en el apartado de <strong>transferencias</strong>.
          </motion.p>
        </div>
      </motion.div>

      {/* FORM CARD */}
      <motion.div
        className="transfer-card glass rounded-4 shadow-lg mx-auto"
        style={{ maxWidth: 560 }}
        variants={fadeUp}
        custom={2}
      >
        <Badge bg="primary" className="mb-3">
          <i className="bi bi-arrow-left-right me-1"></i> Transferencia segura
        </Badge>

        <Form onSubmit={openConfirm} noValidate>
          {/* Desde */}
          <motion.div className="mb-3" variants={fadeUp} custom={3}>
            <Form.Label className="fw-medium">Desde cuenta</Form.Label>
            {loadingAccounts ? (
              <div className="d-flex align-items-center gap-2 text-muted small">
                <Spinner animation="border" size="sm" /> Cargando cuentas...
              </div>
            ) : accountsError ? (
              <Alert variant="danger" className="py-2 px-3 small mb-0">
                {accountsError}
              </Alert>
            ) : (
              <>
                <Form.Select
                  name="fromAccountId"
                  value={form.fromAccountId}
                  onChange={handleChange}
                  isInvalid={!!errors.fromAccountId}
                  disabled={isClientRole(role) && ownAccounts.length === 0}
                >
                  <option value="">-- selecciona origen --</option>
                  {ownAccounts.map((acct) => (
                    <option key={acct.id} value={acct.id}>
                      {acct.accountNumber} (Saldo: {currency(acct.balance)})
                    </option>
                  ))}
                </Form.Select>

                {isClientRole(role) && !loadingAccounts && ownAccounts.length === 0 && (
                  <Alert variant="warning" className="mt-2 small mb-0">
                    No tienes cuentas activas para transferir. Comunícate con soporte.
                  </Alert>
                )}
              </>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.fromAccountId}
            </Form.Control.Feedback>
          </motion.div>

          {/* Hacia */}
          <motion.div className="mb-3" variants={fadeUp} custom={4}>
            <Form.Label className="fw-medium">Hacia cuenta</Form.Label>
            {loadingAccounts ? (
              <div className="d-flex align-items-center gap-2 text-muted small">
                <Spinner animation="border" size="sm" /> ...
              </div>
            ) : (
              <Form.Select
                name="toAccountId"
                value={form.toAccountId}
                onChange={handleChange}
                isInvalid={!!errors.toAccountId}
                disabled={!form.fromAccountId}
              >
                <option value="">-- selecciona destino --</option>
                {accounts
                  ?.filter((a) => a.id !== form.fromAccountId)
                  .map((acct) => (
                    <option key={acct.id} value={acct.id}>
                      {acct.accountNumber} (Saldo: {currency(acct.balance)})
                    </option>
                  ))}
              </Form.Select>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.toAccountId}
            </Form.Control.Feedback>
          </motion.div>

          {/* Monto */}
          <motion.div className="mb-3" variants={fadeUp} custom={5}>
            <Form.Label className="fw-medium">Monto (Q)</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={form.amount}
              onChange={handleChange}
              isInvalid={!!errors.amount}
              placeholder="0.00"
              disabled={loadingAccounts}
            />
            <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
            {form.amount && !errors.amount && (
              <small className="text-muted d-block mt-1">
                {isImmediate
                  ? "Montos menores a Q2,000 se acreditan de forma inmediata."
                  : "Montos ≥ Q2,000 pueden tardar algunos minutos."}
              </small>
            )}
          </motion.div>

          {/* Concepto */}
          <motion.div className="mb-3" variants={fadeUp} custom={6}>
            <Form.Label className="fw-medium">Motivo / Concepto</Form.Label>
            <Form.Control
              name="concept"
              type="text"
              value={form.concept}
              onChange={handleChange}
              isInvalid={!!errors.concept}
              placeholder="Ej. Pago de préstamo"
            />
            <Form.Control.Feedback type="invalid">{errors.concept}</Form.Control.Feedback>
          </motion.div>

          {/* Notas */}
          <motion.div className="mb-4" variants={fadeUp} custom={7}>
            <Form.Label className="fw-medium">Notas (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              isInvalid={!!errors.notes}
              placeholder="Información adicional"
            />
            <Form.Control.Feedback type="invalid">{errors.notes}</Form.Control.Feedback>
          </motion.div>

          {/* Warning */}
          <motion.div className="alert alert-warning small mb-4" variants={fadeUp} custom={8}>
            <i className="bi bi-exclamation-triangle-fill me-2" />
            La transferencia <strong>no se puede anular</strong> una vez confirmada.
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isTransferring || loadingAccounts || (isClientRole(role) && ownAccounts.length === 0)}
            variants={fadeUp}
            custom={9}
          >
            {isTransferring ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" /> Procesando...
              </>
            ) : (
              "Continuar"
            )}
          </motion.button>

          {/* Error global */}
          <AnimatePresence>
            {transferError && (
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Alert variant="danger" className="mb-0 small">
                  {transferError}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </Form>
      </motion.div>

      {/* RECIBO */}
      <AnimatePresence>
        {tx && (
          <motion.div
            className="transfer-receipt alert alert-success mt-4 position-relative mx-auto"
            style={{ maxWidth: 560 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <div ref={receiptRef} id="transfer-receipt" className="receipt-paper position-relative">
              {/* Marca de agua */}
              <div className="receipt-watermark" aria-hidden="true">
                <img src={LOGO_URL} alt="logo" />
                <span>BANCA KINAL</span>
              </div>

              {/* Encabezado */}
              <div className="d-flex align-items-center mb-3">
                <img src={LOGO_URL} alt="logo" width="42" height="42" className="me-2" />
                <div>
                  <h6 className="mb-0 fw-bold">Comprobante de Transferencia</h6>
                  <small className="text-muted">Banca Kinal</small>
                </div>
              </div>

              {/* Datos */}
              <ul className="small mb-3">
                <li><strong>ID Transacción:</strong> {tx.id || "N/D"}</li>
                <li><strong>Cuenta origen:</strong> {tx.fromAccountNumber || renderAcct(accounts, form.fromAccountId)}</li>
                <li><strong>Cuenta destino:</strong> {tx.toAccountNumber || renderAcct(accounts, form.toAccountId)}</li>
                <li><strong>Monto:</strong> {currency(form.amount)}</li>
                <li><strong>Concepto:</strong> {form.concept}</li>
                {form.notes && <li><strong>Notas:</strong> {form.notes}</li>}
                {balances && (
                  <>
                    <li><strong>Saldo origen:</strong> {currency(balances.from)}</li>
                    <li><strong>Saldo destino:</strong> {currency(balances.to)}</li>
                  </>
                )}
                <li><strong>Fecha:</strong> {new Date().toLocaleString()}</li>
                <li><strong>Fingerprint:</strong> {fingerprint}</li>
              </ul>

              <p className="text-muted small mb-0">
                Verifique el fingerprint para validar este comprobante.
              </p>
            </div>

            <Button
              variant="outline-success"
              size="sm"
              className="mt-3"
              onClick={saveReceipt}
              disabled={savingReceipt}
            >
              {savingReceipt ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Generando...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-1" /> Descargar comprobante
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CONFIRMACIÓN */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-shield-lock me-2" />
            Confirmar transferencia
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-3">
            Verifica los datos. Una vez confirmada, la transferencia no puede anularse.
          </p>

          <div className="bg-light rounded-3 p-3 mb-3 small">
            <p className="mb-1">
              <strong>Desde:</strong> {renderAcct(accounts, form.fromAccountId)}
            </p>
            <p className="mb-1">
              <strong>Hacia:</strong> {renderAcct(accounts, form.toAccountId)}
            </p>
            <p className="mb-1">
              <strong>Monto:</strong> {currency(form.amount)}
            </p>
            <p className="mb-1">
              <strong>Concepto:</strong> {form.concept || "-"}
            </p>
            {form.notes && (
              <p className="mb-1">
                <strong>Notas:</strong> {form.notes}
              </p>
            )}
            <p className="mb-0">
              <strong>Acreditación:</strong>{" "}
              {isImmediate ? "Inmediata (< Q2,000)" : "Puede demorar algunos minutos"}
            </p>
          </div>

          <Form.Check
            type="checkbox"
            id="accept-terms-transfer"
            className="mb-3 small"
            label="Acepto que esta operación es definitiva y no puede ser anulada."
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />

          <Form.Group className="mb-0 small">
            <Form.Label className="mb-1">
              Para autorizar escribe: <code>CONFIRMAR</code>
            </Form.Label>
            <Form.Control
              type="text"
              value={authWord}
              onChange={(e) => setAuthWord(e.target.value)}
              autoComplete="off"
              placeholder="CONFIRMAR"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={doConfirm} disabled={isTransferring}>
            {isTransferring ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Confirmando...
              </>
            ) : (
              "Confirmar transferencia"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

/* Helper para mostrar cuenta */
function renderAcct(list = [], id = "") {
  const a = list.find((x) => x.id === id);
  if (!a) return id || "-";
  return `${a.accountNumber} (Saldo: Q${Number(a.balance).toFixed(2)})`;
}

export default TransferForm;
