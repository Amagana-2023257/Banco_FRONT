// src/components/layout/ExchangeTicker.jsx
import React, { useState, useEffect, useRef } from "react";
import { useExchangeRates } from "../../shared/hooks/useExchangeRates";

export const ExchangeTicker = () => {
  const { rates, timestamp, isLoading, error } = useExchangeRates();
  const [index, setIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const containerRef = useRef(null);
  const textRef = useRef(null);

  const handleAnimationEnd = () => {
    setIndex((prev) => (rates.length > 0 ? (prev + 1) % rates.length : 0));
    setAnimKey((k) => k + 1);
  };

  let displayText = "";
  if (isLoading) {
    displayText =
      "Cargando tipo de cambio... * Los tipos de cambio pueden variar según la hora y la fuente.";
  } else if (error) {
    displayText =
      "Error al cargar tipo de cambio * Los tipos de cambio pueden variar según la hora y la fuente.";
  } else if (rates.length > 0) {
    const r = rates[index];
    const rateStr = `1 ${r.currency} = Q${r.rate.toFixed(2)}`;
    let timeInfo = "";
    if (timestamp) {
      timeInfo = `(${timestamp})`;
    }
    displayText = `Tipo de cambio actual: ${rateStr} ${timeInfo} *Puede cambiar según la hora y la fuente*`;
  } else {
    displayText =
      "No disponible *Los tipos de cambio pueden variar según la hora y la fuente*";
  }

  useEffect(() => {
    const calculateDuration = () => {
      if (!containerRef.current || !textRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const tw = textRef.current.offsetWidth;
      const speed = 60; // px/s
      const time = (cw + tw) / speed;
      setDuration(time);
    };
    setTimeout(calculateDuration, 0);
    window.addEventListener("resize", calculateDuration);
    return () => window.removeEventListener("resize", calculateDuration);
  }, [displayText]);

  return (
    <div
      ref={containerRef}
      className="w-100"
      style={{
        height: "40px",
        backgroundColor: "rgba(0, 83, 155, 0.8)",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <div style={{ display: "inline-block", whiteSpace: "nowrap" }}>
        <span
          key={animKey}
          ref={textRef}
          className="text-white"
          style={{
            display: "inline-block",
            paddingLeft: "100%",
            lineHeight: "40px",
            fontSize: "0.9rem",
            animation: `tickerMove ${duration}s linear forwards`,
          }}
          onAnimationEnd={handleAnimationEnd}
        >
          {displayText}
        </span>
      </div>
      <style>
        {`
          @keyframes tickerMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
};

export default ExchangeTicker;
