// src/components/nav/Sidebar.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { ListGroup, Collapse } from 'react-bootstrap';
import { useUserDetails } from '../../shared/hooks/useUserDetails';

const MENU = [
  { path: '/dashboard', label: 'Inicio', roles: ['ALL'] },
];

const USERS_MENU = [
  { path: '/dashboard/users',       label: 'Listado',   key: 'list'   },
  { path: '/dashboard/users/create', label: 'Crear',     key: 'create' },
];

const ACCOUNTS_MENU = [
  { path: '/dashboard/accounts',        label: 'Listado', key: 'list'   },
  { path: '/dashboard/accounts/create', label: 'Crear',   key: 'create' },
];

const TRANSACTIONS_MENU = [
  { path: '/dashboard/transactions',            label: 'Listado',      key: 'list'     },
  { path: '/dashboard/transactions/deposit',    label: 'Depósito',     key: 'deposit'  },
  { path: '/dashboard/transactions/transfer',   label: 'Transferencia',key: 'transfer' },
  { path: '/dashboard/transactions/purchase',   label: 'Compra',       key: 'purchase' },
  { path: '/dashboard/transactions/credit',     label: 'Crédito',      key: 'credit'   },
];

export const Sidebar = ({ onLinkClick }) => {
  const { role } = useUserDetails();
  const location = useLocation();

  const [openUsers, setOpenUsers] = useState(location.pathname.startsWith('/dashboard/users'));
  const [openAccounts, setOpenAccounts] = useState(location.pathname.startsWith('/dashboard/accounts'));
  const [openTx, setOpenTx] = useState(location.pathname.startsWith('/dashboard/transactions'));

  // filter helpers
  const showUsers    = ['ADMIN_GLOBAL','GERENTE_SUCURSAL'].includes(role);
  const showAccounts = ['ADMIN_GLOBAL','GERENTE_SUCURSAL'].includes(role);
  const showTxList   = ['ADMIN_GLOBAL','GERENTE_SUCURSAL','CAJERO'].includes(role);

  const userOps = USERS_MENU.filter(op => {
    if (op.key === 'list')   return showUsers;
    return false;
  });

  const acctOps = ACCOUNTS_MENU.filter(op => {
    if (op.key === 'list')   return showAccounts;
    if (op.key === 'create') return ['ADMIN_GLOBAL','GERENTE_SUCURSAL'].includes(role);
    return false;
  });

  const txOps = TRANSACTIONS_MENU.filter(op => {
    if (op.key === 'list')     return showTxList;
    if (op.key === 'deposit')  return ['ADMIN_GLOBAL','CAJERO','CLIENTE'].includes(role);
    if (op.key === 'transfer'|| op.key === 'purchase') return role === 'ADMIN_GLOBAL','CLIENTE';
    if (op.key === 'credit')   return role === 'ADMIN_GLOBAL','CAJERO';
    return false;
  });

  return (
    <div className="bg-white border-end vh-100" style={{ width: 220 }}>
      <ListGroup variant="flush">

        {MENU.map(item => (
          <ListGroup.Item key={item.path} className="p-0 border-0">
            <NavLink
              to={item.path}
              onClick={onLinkClick}
              className={({ isActive }) =>
                `d-block py-2 px-3 text-decoration-none ${
                  isActive ? 'bg-primary text-white' : 'text-dark'
                }`
              }
            >
              {item.label}
            </NavLink>
          </ListGroup.Item>
        ))}

        {/* Usuarios */}
        {showUsers && (
          <ListGroup.Item className="p-0 border-0">
            <button
              className="btn btn-toggle align-items-center rounded w-100 text-start px-3"
              onClick={() => setOpenUsers(!openUsers)}
              aria-expanded={openUsers}
            >
              Usuarios
            </button>
            <Collapse in={openUsers}>
              <ListGroup variant="flush" className="ms-3">
                {userOps.map(op => (
                  <ListGroup.Item key={op.path} className="p-0 border-0">
                    <NavLink
                      to={op.path}
                      onClick={onLinkClick}
                      className={({ isActive }) =>
                        `d-block py-2 px-3 text-decoration-none ${
                          isActive ? 'bg-primary text-white' : 'text-dark'
                        }`
                      }
                    >
                      {op.label}
                    </NavLink>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Collapse>
          </ListGroup.Item>
        )}

        {/* Cuentas */}
        {showAccounts && (
          <ListGroup.Item className="p-0 border-0">
            <button
              className="btn btn-toggle align-items-center rounded w-100 text-start px-3"
              onClick={() => setOpenAccounts(!openAccounts)}
              aria-expanded={openAccounts}
            >
              Cuentas
            </button>
            <Collapse in={openAccounts}>
              <ListGroup variant="flush" className="ms-3">
                {acctOps.map(op => (
                  <ListGroup.Item key={op.path} className="p-0 border-0">
                    <NavLink
                      to={op.path}
                      onClick={onLinkClick}
                      className={({ isActive }) =>
                        `d-block py-2 px-3 text-decoration-none ${
                          isActive ? 'bg-primary text-white' : 'text-dark'
                        }`
                      }
                    >
                      {op.label}
                    </NavLink>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Collapse>
          </ListGroup.Item>
        )}

        {/* Transacciones */}
        {showTxList && (
          <ListGroup.Item className="p-0 border-0">
            <button
              className="btn btn-toggle align-items-center rounded w-100 text-start px-3"
              onClick={() => setOpenTx(!openTx)}
              aria-expanded={openTx}
            >
              Transacciones
            </button>
            <Collapse in={openTx}>
              <ListGroup variant="flush" className="ms-3">
                {txOps.map(op => (
                  <ListGroup.Item key={op.path} className="p-0 border-0">
                    <NavLink
                      to={op.path}
                      onClick={onLinkClick}
                      className={({ isActive }) =>
                        `d-block py-2 px-3 text-decoration-none ${
                          isActive ? 'bg-primary text-white' : 'text-dark'
                        }`
                      }
                    >
                      {op.label}
                    </NavLink>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Collapse>
          </ListGroup.Item>
        )}

      </ListGroup>
    </div>
  );
};

Sidebar.propTypes = {
  onLinkClick: PropTypes.func,
};
