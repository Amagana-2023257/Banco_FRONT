// src/components/purchase/PurchaseReceipt.jsx
import React, { forwardRef } from "react";
import LOGO_URL from "../../../assets/logo.png";
import { currency } from "./utils";

export const PurchaseReceipt = forwardRef(
  ({ txn, data, balances, fingerprint }, ref) => {
    return (
      <div ref={ref} id="purchase-receipt" className="receipt-paper position-relative">
        <div className="receipt-watermark" aria-hidden="true">
          <img src={LOGO_URL} alt="logo" />
          <span>BANCA KINAL</span>
        </div>

        <div className="d-flex align-items-center mb-3">
          <img src={LOGO_URL} alt="logo" width="42" height="42" className="me-2" />
          <div>
            <h6 className="mb-0 fw-bold">Comprobante de Compra</h6>
            <small className="text-muted">Banca Kinal</small>
          </div>
        </div>

        <ul className="small mb-3">
          <li><strong>ID Transacción:</strong> {txn.id || "N/D"}</li>
          <li><strong>Producto:</strong> {data.product?.title}</li>
          <li><strong>Cantidad:</strong> {data.qty}</li>
          <li><strong>Total:</strong> {currency(data.total)}</li>
          <li>
            <strong>Cuenta:</strong> {data.accountLabel} — {data.accountType} / {data.accountCurrency}
          </li>
          {balances?.from != null && (
            <li><strong>Nuevo saldo:</strong> {currency(balances.from)}</li>
          )}
          <li><strong>Fecha:</strong> {new Date().toLocaleString()}</li>
          <li><strong>Fingerprint:</strong> {fingerprint}</li>
        </ul>

        <p className="text-muted small mb-0">
          Verifique el código/fingerprint para validar este comprobante.
        </p>
      </div>
    );
  }
);

export default PurchaseReceipt;
