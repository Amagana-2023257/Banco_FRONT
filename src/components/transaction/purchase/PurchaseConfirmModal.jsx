// src/components/purchase/PurchaseConfirmModal.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import { currency } from "./utils";

export const PurchaseConfirmModal = ({
  show,
  onHide,
  data,
  onConfirm,
  isProcessing,
}) => {
  const [accept, setAccept] = useState(false);
  const [authWord, setAuthWord] = useState("");

  const handleOk = () => {
    if (!accept) return;
    if (authWord.toUpperCase() !== "CONFIRMAR") return;
    onConfirm();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-shield-lock me-2" />
          Confirmar compra
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data && (
          <>
            <p className="small text-muted mb-3">
              Verifica los datos. Una vez confirmada, la compra no puede anularse.
            </p>

            <div className="bg-light rounded-3 p-3 mb-3 small">
              <p className="mb-1">
                <strong>Producto:</strong> {data.product.title}
              </p>
              <p className="mb-1">
                <strong>Cantidad:</strong> {data.qty}
              </p>
              <p className="mb-1">
                <strong>Total:</strong> {currency(data.total)}
              </p>
              <p className="mb-1">
                <strong>Cuenta origen:</strong> {data.accountLabel}
              </p>
              <p className="mb-0">
                <strong>Acreditación:</strong>{" "}
                {data.total < 2000
                  ? "Inmediata (< Q2,000)"
                  : "Puede demorar algunos minutos"}
              </p>
            </div>

            <Form.Check
              type="checkbox"
              id="accept-terms-purchase"
              className="mb-3 small"
              label="Acepto que esta operación es definitiva y no puede ser anulada."
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
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
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleOk}
          disabled={isProcessing || !accept || authWord.toUpperCase() !== "CONFIRMAR"}
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" /> Confirmando...
            </>
          ) : (
            "Confirmar compra"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PurchaseConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  data: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
};
