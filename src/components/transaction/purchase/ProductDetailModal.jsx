// src/components/purchase/ProductDetailModal.jsx
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const ProductDetailModal = ({
  show,
  onHide,
  product,
  onContinue,
}) => {
  const [qty, setQty] = useState(1);

  const total = useMemo(() => Number(product?.price || 0) * qty, [product, qty]);

  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <i className="bi bi-bag-check" />
          {product.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <motion.div variants={fade} initial="hidden" animate="visible">
          <div className="row g-3">
            <div className="col-12 col-md-5">
              <div
                className="detail-img rounded-3"
                style={{ backgroundImage: `url(${product.image})` }}
              />
            </div>
            <div className="col-12 col-md-7">
              <p className="small text-muted mb-1">{product.provider}</p>
              <h6 className="fw-semibold">{product.promo}</h6>
              <p className="small mb-2">{product.description}</p>
              <p className="small text-muted mb-3">
                <i className="bi bi-info-circle me-1" />
                {product.terms}
              </p>

              <Form.Group className="mb-3 w-50">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5">Total: Q{total.toFixed(2)}</span>
                <Button
                  variant="primary"
                  onClick={() => onContinue(product, qty, total)}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Modal.Body>
    </Modal>
  );
};

ProductDetailModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  product: PropTypes.object,
  onContinue: PropTypes.func.isRequired,
};
