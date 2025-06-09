// src/components/account/AllAccounts.jsx
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
  Collapse,
  Badge,
} from 'react-bootstrap';
import { useGetAllAccounts } from '../../shared/hooks/useGetAllAccounts';
import { useGetAllTransactions } from '../../shared/hooks/useGetAllTransactions';
import { useUserDetails } from '../../shared/hooks/useUserDetails';

const movementTypes = ['Todos', 'transferencia', 'compra', 'crédito'];

const normalize = str =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const AllAccounts = () => {
  const {
    accounts, getAllAccounts, isLoading: loadingA, error: errorA
  } = useGetAllAccounts();
  const {
    transactions, getAllTransactions, isLoading: loadingT, error: errorT
  } = useGetAllTransactions();
  const { role } = useUserDetails();

  const [searchTerm, setSearchTerm]     = useState('');
  const [filterType, setFilterType]     = useState('Todos');
  const [sortOrder, setSortOrder]       = useState('desc');
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage                    = 10;
  const [expandedRows, setExpandedRows] = useState([]);

  const canList = role === 'ADMIN_GLOBAL';

  useEffect(() => { if (canList) getAllAccounts(); }, [canList]);
  useEffect(() => { if (canList) getAllTransactions(); }, [canList]);

  if (!canList)    return <Alert variant="warning">Sin permisos.</Alert>;
  if (loadingA || loadingT)
    return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (errorA)      return <Alert variant="danger">{errorA}</Alert>;
  if (errorT)      return <Alert variant="danger">{errorT}</Alert>;

  // 1) Filtrar
  const term = normalize(searchTerm);
  let filtered = accounts.filter(a =>
    normalize(a.accountNumber).includes(term) ||
    normalize(a.currency).includes(term)
  );

  // 2) preparar clave
  const filterKey = filterType === 'Todos' ? null : normalize(filterType);

  // 3) contar movimientos
  const withCounts = filtered.map(a => {
    const count = transactions.filter(t => {
      const byId  = t.accountId === a.id;
      const byNum = t.account?.accountNumber === a.accountNumber;
      if (!byId && !byNum) return false;
      if (!filterKey)       return true;
      return normalize(t.type) === filterKey;
    }).length;
    return { ...a, moveCount: count };
  });

  // 4) excluir 0 si filtrar
  const nonEmpty = filterKey
    ? withCounts.filter(a => a.moveCount > 0)
    : withCounts;

  // 5) ordenar
  nonEmpty.sort((a, b) =>
    sortOrder === 'asc' ? a.moveCount - b.moveCount : b.moveCount - a.moveCount
  );

  // 6) paginar
  const totalPages = Math.ceil(nonEmpty.length / itemsPerPage);
  const current    = nonEmpty.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleRow = id =>
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <Container fluid className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Cuentas</h5>
          <Button variant="light" size="sm" onClick={() => { getAllAccounts(); getAllTransactions(); }}>
            <i className="bi bi-arrow-clockwise" />
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="gy-2 mb-3">
            <Col md={4}>
              <InputGroup>
                <Form.Control
                  placeholder="Buscar número o moneda"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                <Button variant="outline-secondary" onClick={() => { setSearchTerm(''); setCurrentPage(1); }}>
                  <i className="bi bi-x-circle" />
                </Button>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterType}
                onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
              >
                {movementTypes.map(t =>
                  <option key={t} value={t}>{t}</option>
                )}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="asc">Menos movs ↑</option>
                <option value="desc">Más movs ↓</option>
              </Form.Select>
            </Col>
            <Col md={2} className="text-end">
              <small>Total: {nonEmpty.length}</small>
            </Col>
          </Row>

          <div className="table-responsive" style={{ maxHeight: '60vh' }}>
            <Table hover size="sm" className="align-middle mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th />
                  <th>ID</th>
                  <th>Número</th>
                  <th>Saldo</th>
                  <th>Moneda</th>
                  <th>Movs</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {current.map(a => (
                  <React.Fragment key={a.id}>
                    <tr>
                      <td>
                        <Button variant="link" size="sm" onClick={() => toggleRow(a.id)}>
                          <i className={`bi bi-chevron-${expandedRows.includes(a.id) ? 'up' : 'down'}`} />
                        </Button>
                      </td>
                      <td>{a.id.slice(-6)}</td>
                      <td>{a.accountNumber}</td>
                      <td>Q{a.balance.toFixed(2)}</td>
                      <td>{a.currency}</td>
                      <td>
                        <Badge bg="info">{a.moveCount}</Badge>
                      </td>
                      <td>
                        <Badge bg={a.status ? 'success' : 'secondary'}>
                          {a.status ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={7} className="p-0 border-0">
                        <Collapse in={expandedRows.includes(a.id)}>
                          <div className="p-3 bg-white border-top small">
                            <Row>
                              <Col md={6}><strong>Usuario:</strong> {a.user?.name} {a.user?.surname}</Col>
                              <Col md={6}><strong>Email:</strong> {a.user?.email}</Col>
                            </Row>
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
            <Pagination className="justify-content-center mt-3">
              {Array.from({ length: totalPages }, (_, i) =>
                <Pagination.Item
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              )}
            </Pagination>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
