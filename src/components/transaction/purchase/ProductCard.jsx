// src/components/purchase/ProductCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const ProductCard = ({ product, onSelect }) => {
  return (
    <motion.div
      className="product-card glass h-100 d-flex flex-column"
      variants={cardVariant}
      initial="hidden"
      animate="visible"
    >
      <div
        className="product-card__img"
        style={{ backgroundImage: `url(${product.image})` }}
      />
      <div className="p-3 d-flex flex-column flex-grow-1">
        <h6 className="mb-1 fw-semibold">{product.title}</h6>
        <small className="text-muted d-block mb-2">{product.provider}</small>
        <p className="product-card__promo small text-primary mb-2">
          <i className="bi bi-stars me-1" /> {product.promo}
        </p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold">Q{product.price.toFixed(2)}</span>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onSelect(product)}
          >
            Ver más
          </button>
        </div>
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
