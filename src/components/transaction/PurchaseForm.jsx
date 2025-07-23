// src/components/transaction/PurchaseForm.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Badge, Spinner, Alert, Button, Offcanvas } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

import { usePurchase } from "../../shared/hooks/usePurchase";
import { useGetAllAccounts } from "../../shared/hooks/useGetAllAccounts";
import { useUserDetails } from "../../shared/hooks/useUserDetails";

import { PRODUCTS } from "./purchase/data/products";
import { ProductGrid } from "./purchase/ProductGrid";
import { ProductDetailModal } from "./purchase/ProductDetailModal";
import { PurchaseConfirmModal } from "./purchase/PurchaseConfirmModal";
import { PurchaseReceipt } from "./purchase/PurchaseReceipt";

import {
  currency,
  normalizeId,
  isClientRole,
  guessType,
} from "./purchase/utils";

import "./PurchaseForm.css";

const HERO_IMG =
  "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=1600&q=80";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" },
  }),
};

const buildFingerprint = (id) =>
  btoa(`${id || "tmp"}-${Date.now()}-${Math.random()}`).slice(0, 22);

/* ---------- Helpers para evitar PNG en blanco ---------- */
const nextFrame = () =>
  new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

const waitForImages = async (node) => {
  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => {
            img.onload = img.onerror = res;
          })
    )
  );
};

const cloneForPrint = (node) => {
  const clone = node.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.opacity = "1";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "9999";
  clone.style.background = "#fff";
  document.body.appendChild(clone);
  return clone;
};
/* ---------------------------------------------- */

export const PurchaseForm = () => {
  const { purchase, txn, balances, isLoading: isPurchasing, error: purchaseError } =
    usePurchase();
  const {
    accounts,
    getAllAccounts,
    isLoading: loadingAccounts,
    error: accountsError,
  } = useGetAllAccounts();
  const { role, id: userId } = useUserDetails();

  const myId = String(userId || "");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseData, setPurchaseData] = useState(null); // { product, qty, total, accountId, accountLabel, ... }
  const [fingerprint, setFingerprint] = useState("");
  const [savingReceipt, setSavingReceipt] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);

  const [autoDownloaded, setAutoDownloaded] = useState(false);

  const receiptRef = useRef(null);

  /* Cargar cuentas */
  useEffect(() => {
    getAllAccounts();
  }, [getAllAccounts]);

  const ownAccounts = useMemo(() => {
    if (!accounts) return [];
    if (!isClientRole(role)) return accounts;
    return accounts.filter(
      (a) => normalizeId(a.user) === myId && a.status !== false
    );
  }, [accounts, role, myId]);

  const openAccountSheet = (data = null) => {
    const target = data || purchaseData;
    if (!target) {
      toast.error("No hay datos de compra.");
      return;
    }
    if (isClientRole(role) && ownAccounts.length === 0) {
      toast.error("No tienes cuentas activas para comprar.");
      return;
    }
    if (data) setPurchaseData(data);
    setShowAccountSheet(true);
  };

  const chooseAccount = (acct) => {
    setPurchaseData((p) => ({
      ...p,
      accountId: acct.id,
      accountLabel: `${acct.accountNumber} (Saldo: ${currency(acct.balance)})`,
      accountType: guessType(acct),
      accountCurrency: acct.currency || "GTQ",
    }));
    setShowAccountSheet(false);
    setConfirmOpen(true);
  };

  const saveReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      setSavingReceipt(true);

      // Clonar nodo para garantizar render correcto
      const clone = cloneForPrint(receiptRef.current);
      await nextFrame();
      await waitForImages(clone);

      const canvas = await html2canvas(clone, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      });

      document.body.removeChild(clone);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `comprobante-compra-${txn?.id || Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo generar el comprobante.");
    } finally {
      setSavingReceipt(false);
    }
  };

  /* Auto-descarga tras éxito */
  useEffect(() => {
    const run = async () => {
      if (!txn || !purchaseData || autoDownloaded || purchaseError) return;
      setFingerprint(buildFingerprint(txn.id));
      await nextFrame();
      await saveReceipt();
      setAutoDownloaded(true);
      toast.success("Comprobante descargado.");
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txn, purchaseData, autoDownloaded, purchaseError]);

  const handleConfirmPurchase = async () => {
    setConfirmOpen(false);
    if (!purchaseData) return;
    await purchase({
      accountId: purchaseData.accountId,
      amount: purchaseData.total,
      concept: `Compra: ${purchaseData.product.title}`,
      notes: `Cantidad: ${purchaseData.qty}`,
    });
  };

  return (
    <motion.div initial="hidden" animate="visible" className="purchase-container">
      {/* HERO */}
      <motion.div className="purchase-hero" variants={fadeUp}>
        <div
          className="purchase-hero__bg"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
          aria-hidden="true"
        />
        <div className="purchase-hero__overlay" aria-hidden="true" />
        <div className="purchase-hero__content text-center text-white">
          <motion.h1 className="display-6 fw-bold mb-2" variants={fadeUp} custom={0}>
            Promociones & Compras
          </motion.h1>
          <motion.p className="small mb-0" variants={fadeUp} custom={1}>
            Productos externos con ofertas exclusivas para clientes Banca Kinal.
          </motion.p>
        </div>
      </motion.div>

      {/* CATÁLOGO */}
      <motion.div
        className="purchase-card glass rounded-4 shadow-lg mx-auto mb-4"
        style={{ maxWidth: 1200 }}
        variants={fadeUp}
        custom={2}
      >
        <Badge bg="primary" className="mb-3">
          <i className="bi bi-bag-heart me-1"></i> Catálogo de promociones
        </Badge>

        <ProductGrid products={PRODUCTS} onSelect={(p) => setSelectedProduct(p)} />
      </motion.div>

      {/* ERROR GLOBAL */}
      <AnimatePresence>
        {purchaseError && (
          <motion.div
            className="mt-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Alert variant="danger" className="mb-0 small">
              {purchaseError}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECIBO OCULTO SOLO PARA DESCARGA */}
      {txn && purchaseData && (
        <div
          ref={receiptRef}
          style={{
            position: "fixed",
            left: "-99999px",
            top: 0,
            width: "600px",
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
            background: "#fff",
          }}
          aria-hidden="true"
        >
          <PurchaseReceipt
            txn={txn}
            data={purchaseData}
            balances={balances}
            fingerprint={fingerprint}
          />
        </div>
      )}

      {/* MODAL DETALLE PRODUCTO */}
      <ProductDetailModal
        show={!!selectedProduct}
        onHide={() => setSelectedProduct(null)}
        product={selectedProduct}
        onContinue={(product, qty, total) => {
          const data = {
            product,
            qty,
            total,
            accountId: "",
            accountLabel: "",
            accountType: "",
            accountCurrency: "",
          };
          setSelectedProduct(null);
          setPurchaseData(data);
          setTimeout(() => openAccountSheet(data), 0);
        }}
      />

      {/* SHEET CUENTAS */}
      <Offcanvas
        show={showAccountSheet}
        onHide={() => setShowAccountSheet(false)}
        placement="bottom"
        className="account-sheet"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="d-flex align-items-center gap-2">
            <i className="bi bi-credit-card-2-front" /> Selecciona cuenta
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
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
              {isClientRole(role) && ownAccounts.length === 0 && (
                <Alert variant="warning" className="small mb-3">
                  No tienes cuentas activas para comprar. Comunícate con soporte.
                </Alert>
              )}

              {(isClientRole(role) ? ownAccounts : accounts).map((acct) => (
                <button
                  key={acct.id}
                  className="account-sheet__item w-100 text-start mb-2"
                  onClick={() => chooseAccount(acct)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">{acct.accountNumber}</span>
                    <Badge bg="secondary" pill className="ms-2">
                      {acct.currency || "GTQ"}
                    </Badge>
                  </div>
                  <div className="small text-muted mt-1">
                    Tipo: {guessType(acct)} • Saldo: {currency(acct.balance)}
                  </div>
                </button>
              ))}
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* CONFIRM MODAL */}
      <PurchaseConfirmModal
        show={confirmOpen}
        onHide={() => setConfirmOpen(false)}
        data={purchaseData}
        onConfirm={handleConfirmPurchase}
        isProcessing={isPurchasing}
      />
    </motion.div>
  );
};

export default PurchaseForm;
