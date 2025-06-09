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
import { useGetAllTransactions } from '../../shared/hooks/useGetAllTransactions';
import { useGetAllAccounts } from '../../shared/hooks/useGetAllAccounts';
import { useUserDetails } from '../../shared/hooks/useUserDetails';

export const AllTransactions = () => {
  const { transactions, getAllTransactions, isLoading, error } = useGetAllTransactions();
  const { accounts, getAllAccounts } = useGetAllAccounts();
  const { role } = useUserDetails();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [expandedRows, setExpandedRows] = useState([]);

  const canList = ['ADMIN_GLOBAL', 'GERENTE_SUCURSAL', 'CAJERO'].includes(role);

  useEffect(() => {
    if (canList) getAllTransactions();
    if (canList) getAllAccounts();
  }, [canList]);

  if (!canList) return <Alert variant="warning">Sin permisos para listar transacciones.</Alert>;
  if (isLoading) return <Spinner className="center-screen" animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Filtrado con seguridad ante undefined
  const term = searchTerm.toLowerCase();
  const normalized = transactions.map(t => {
    const idStr = (t.id ?? t._id ?? '').toString();
    return {
      ...t,
      _key: idStr,
      _shortId: idStr.slice(-6),
    };
  });

  const filtered = normalized.filter(t => {
    const id = t._key.toLowerCase();
    const type = t.type?.toLowerCase() ?? '';
    const accNum = t.account?.accountNumber?.toLowerCase() ?? '';
    return id.includes(term) || type.includes(term) || accNum.includes(term);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleRow = key =>
    setExpandedRows(prev =>
      prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]
    );

  return (
    <Container fluid className="mt-3">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white d-flex justify-content-between shadow">
          <h5>Transacciones</h5>
          <Button variant="light" size="sm" onClick={getAllTransactions}>
            <i className="bi bi-arrow-clockwise" />
          </Button>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="mb-3">
            <Col xs={12} md={6} className="mb-2">
              <InputGroup>
                <Form.Control
                  placeholder="Buscar por ID, tipo o cuenta"
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ paddingLeft: '1rem' }}
                />
                <Button variant="outline-secondary" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="ms-2">
                  <i className="bi bi-x-circle" />
                </Button>
              </InputGroup>
            </Col>
            <Col xs={12} md={6} className="text-md-end">
              <small>Total: {filtered.length}</small>
            </Col>
          </Row>
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <Table hover size="sm" className="table-striped mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th></th>
                  {['ID', 'Cuenta', 'Tipo', 'Monto', 'Relacionado', 'Fecha'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.map(t => (
                  <React.Fragment key={t._key}>
                    <tr>
                      <td>
                        <Button variant="link" size="sm" onClick={() => toggleRow(t._key)} className="text-decoration-none">
                          <i className={`bi bi-chevron-${expandedRows.includes(t._key) ? 'up' : 'down'}`} />
                        </Button>
                      </td>
                      <td>{t._shortId}</td>
                      <td>{t.account?.accountNumber ?? '—'}</td>
                      <td>{t.type}</td>
                      <td>Q{t.amount.toFixed(2)}</td>
                      <td>{t.relatedAccount?.accountNumber ?? '—'}</td>
                      <td>{new Date(t.date).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={7} className="p-0">
                        <Collapse in={expandedRows.includes(t._key)}>
                          <div className="p-2 bg-light small">
                            <div><strong>Revertida:</strong> {t.reversed ? 'Sí' : 'No'}</div>
                            <div><strong>Usuario:</strong> {t.account?.user?.username ?? '—'}</div>
                            <div><strong>Correo:</strong> {t.account?.user?.email ?? '—'}</div>
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
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                  className="rounded-pill"
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
