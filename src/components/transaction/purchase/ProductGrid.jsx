// src/components/purchase/ProductGrid.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { ProductCard } from "./ProductCard";

export const ProductGrid = ({ products = [], onSelect }) => {
  const grouped = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [products]);

  return (
    <div className="product-grid">
      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat} className="mb-4">
          <h5 className="mb-3">{cat}</h5>
          <div className="row g-3">
            {items.map((p) => (
              <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                <ProductCard product={p} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
