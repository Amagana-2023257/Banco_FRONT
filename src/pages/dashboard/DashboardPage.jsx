// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { NavBar } from '../../components/nav/NavBar';
import { Sidebar } from '../../components/nav/Sidebar';
import { Content } from '../../components/dashboard/Content';

export const DashboardPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(prev => !prev);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar fixed top */}
      <NavBar onToggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar for md+ */}
        <div className="d-none d-md-block">
          <Sidebar />
        </div>

        {/* Offcanvas Sidebar for mobile */}
        <Offcanvas show={showSidebar} onHide={toggleSidebar} backdrop={true}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Sidebar onLinkClick={toggleSidebar} />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main content area */}
        <div className="flex-grow-1 overflow-auto p-3">
          <Content />
        </div>
      </div>
    </div>
  );
};
