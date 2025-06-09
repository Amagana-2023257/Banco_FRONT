// src/components/users/UserList.jsx (en Content)
import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
  Button,
  Form,
  InputGroup,
  Pagination,
  Collapse
} from 'react-bootstrap';
import { useGetAllUsers } from '../../shared/hooks/useGetAllUsers';
import { useUserDetails } from '../../shared/hooks/useUserDetails';
import { DeactivateUserButton } from './DeactivateUserButton';
import { useNavigate } from 'react-router-dom';

export const UserList = () => {
  const { users, getAllUsers, isLoading, error } = useGetAllUsers();
  const { role: myRole } = useUserDetails();
  const navigate = useNavigate();

  // permisos para listar cualquier usuario de estos roles
  const canList = ['ADMIN_GLOBAL', 'GERENTE_SUCURSAL', 'CAJERO', 'CLIENTE'].includes(myRole);

  const [searchTerm, setSearchTerm]     = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage]                  = useState(10);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    if (canList) getAllUsers();
  }, [canList, getAllUsers]);

  if (!canList) return <Alert variant="warning">Sin permisos para listar usuarios.</Alert>;
  if (isLoading) return <Spinner className="center-screen" animation="border" />;
  if (error)     return <Alert variant="danger">{error}</Alert>;

  // mostrar solo estos roles
  const allowedRoles = ['ADMIN_GLOBAL', 'GERENTE_SUCURSAL', 'CAJERO', 'CLIENTE'];
  const filtered = users
    .filter(u =>
      allowedRoles.includes(u.role) &&
      `${u.name} ${u.surname} ${u.username}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const current   = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleRow = id =>
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <Container fluid className="mt-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Usuarios</h5>
          <Button variant="light" size="sm" onClick={getAllUsers}>
            <i className="bi bi-arrow-clockwise"/>
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col xs={12} md={6} className="mb-2">
              <InputGroup>
                <Form.Control
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                  <i className="bi bi-x-circle"/>
                </Button>
              </InputGroup>
            </Col>
            <Col xs={12} md={6} className="text-md-end">
              <small>Total: {filtered.length}</small>
            </Col>
          </Row>

          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <Table hover size="sm" className="mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  {['', 'ID', 'Cuenta', 'Nombre', 'Usuario', 'Rol', 'Estado', 'Acciones']
                     .map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {current.map(u => (
                  <React.Fragment key={u.id}>
                    <tr>
                      <td>
                        <Button variant="link" size="sm" onClick={() => toggleRow(u.id)}>
                          <i className={`bi bi-chevron-${expandedRows.includes(u.id) ? 'up' : 'down'}`}/>
                        </Button>
                      </td>
                      <td>{u.id.slice(-6)}</td>
                      <td>{u.accountNumber}</td>
                      <td>{`${u.name} ${u.surname}`}</td>
                      <td>{u.username}</td>
                      <td>{u.role}</td>
                      <td>
                        <span className={`badge ${u.status ? 'bg-success' : 'bg-secondary'}`}>
                          {u.status ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        {/* Ver detalles siempre */}
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/dashboard/users/${u.id}`)}
                          className="me-1"
                        >
                          <i className="bi bi-eye"/>
                        </Button>

                        {/* Si es CLIENTE, permitir editar y desactivar */}
                        {u.role === 'CLIENTE' && (
                          <>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => navigate(`/dashboard/users/${u.id}/edit`)}
                              className="me-1"
                            >
                              <i className="bi bi-pencil"/>
                            </Button>
                            <DeactivateUserButton
                              variant="danger"
                              size="sm"
                              userId={u.id}
                              onDeactivated={getAllUsers}
                            >
                              <i className="bi bi-x-circle"/>
                            </DeactivateUserButton>
                          </>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={8} className="p-0">
                        <Collapse in={expandedRows.includes(u.id)}>
                          <div className="p-2 bg-light small">
                            <div><strong>Email:</strong> {u.email}</div>
                            <div><strong>Tel:</strong> {u.phone}</div>
                            <div>
                              <strong>Ingreso:</strong>{' '}
                              {u.monthlyIncome.toLocaleString('es-GT', {
                                style: 'currency',
                                currency: 'GTQ'
                              })}
                            </div>
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
