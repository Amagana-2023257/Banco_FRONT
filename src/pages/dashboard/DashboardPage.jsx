// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { NavBar } from "../../components/nav/NavBar";
import { Sidebar } from "../../components/nav/Sidebar";
import { MobileBottomBar } from "../../components/nav/MobileBottomBar";
import { Content } from "../../components/dashboard/Content";

export const DashboardPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Top navbar (solo desktop/tablet) */}
      <div className="d-none d-md-block">
        <NavBar onToggleSidebar={toggleSidebar} />
      </div>

      {/* Mobile bottom bar */}
      <MobileBottomBar onMore={toggleSidebar} />

      <div className="d-flex flex-grow-1 mt-0">
        {/* Sidebar desktop */}
        <div className="d-none d-md-block">
          <Sidebar />
        </div>

        {/* Offcanvas Sidebar móvil */}
        <Offcanvas
          show={showSidebar}
          onHide={toggleSidebar}
          placement="start"
          backdrop
          scroll
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Sidebar onLinkClick={toggleSidebar} inOffcanvas />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Contenido principal */}
        <div className="flex-grow-1 overflow-auto p-3 pb-5 pb-md-3">
          {/* pb-5 para que el contenido no quede debajo del bottom bar en móvil */}
          <Content />
        </div>
      </div>
    </div>
  );
};
