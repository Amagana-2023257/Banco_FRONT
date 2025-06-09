// src/components/Layout/Content.jsx
import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { DefaultDashboard } from './DefaultDashboard';
import { ProtectedRoute } from '../routes/ProtectedRoute';

// User management
import { UserList } from '../users/UserList';
import { UserDetails } from '../users/UserDetails';
import { UpdateUserForm } from '../users/UpdateUserForm';
import { DeactivateUserButton } from '../users/DeactivateUserButton';
import { UpdateMeForm } from '../users/UpdateMeForm';

// Account management
import { CreateAccount } from '../account/CreateAccount';
import { AllAccounts } from '../account/AllAccounts';
import { AccountDetails } from '../account/AccountDetails';
import { UpdateAccount } from '../account/UpdateAccount';
import { DeactivateAccount } from '../account/DeactivateAccount';

// Transaction management
import { AllTransactions } from '../transaction/AllTransactions';
import { TransactionDetails } from '../transaction/TransactionDetails';
import { DepositForm } from '../transaction/DepositForm';
import { TransferForm } from '../transaction/TransferForm';
import { PurchaseForm } from '../transaction/PurchaseForm';
import { CreditForm } from '../transaction/CreditForm';
import { UpdateTransactionForm } from '../transaction/UpdateTransactionForm';
import { DeleteTransaction } from '../transaction/DeleteTransaction';

// Wrappers for routes with params
const EditUser = () => {
  const { id } = useParams();
  return <UpdateUserForm userId={id} initialData={{}} />;
};
const DeactivateUser = () => {
  const { id } = useParams();
  return <DeactivateUserButton userId={id} onDeactivated={() => { /* refresh list */ }} />;
};

const AccountById = () => {
  const { id } = useParams();
  return <AccountDetails accountId={id} />;
};
const EditAccount = () => {
  const { id } = useParams();
  return <UpdateAccount />;
};
const DeactivateAcct = () => {
  const { id } = useParams();
  return <DeactivateAccount />;
};

const TxnById = () => {
  const { id } = useParams();
  return <TransactionDetails />;
};
const EditTxn = () => {
  const { id } = useParams();
  return <UpdateTransactionForm />;
};
const DeleteTxn = () => {
  const { id } = useParams();
  return <DeleteTransaction />;
};

export const Content = () => (
  <main className="content-container flex-grow-1 p-4">
    <Routes>

      {/* Default Dashboard */}
      <Route
        path=""
        element={
          <ProtectedRoute>
            <DefaultDashboard />
          </ProtectedRoute>
        }
      />

      {/* Users */}
      <Route
        path="users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL']}>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="users/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL','CAJERO','CLIENTE']}>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="users/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL']}>
            <EditUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="users/:id/deactivate"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <DeactivateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="users/me"
        element={
          <ProtectedRoute>
            <UpdateMeForm initialData={{}} />
          </ProtectedRoute>
        }
      />

      {/* Accounts */}
      <Route
        path="accounts/create"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL']}>
            <CreateAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="accounts"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL']}>
            <AllAccounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="accounts/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL','CAJERO','CLIENTE']}>
            <AccountById />
          </ProtectedRoute>
        }
      />
      <Route
        path="accounts/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL']}>
            <EditAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="accounts/:id/deactivate"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <DeactivateAcct />
          </ProtectedRoute>
        }
      />

      {/* Transactions */}
      <Route
        path="transactions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL','CAJERO']}>
            <AllTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="transactions/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL','CAJERO']}>
            <TxnById />
          </ProtectedRoute>
        }
      />
      <Route
        path="transactions/deposit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','CAJERO','CLIENTE']}>
            <DepositForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="transactions/transfer"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','CLIENTE']}>
            <TransferForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="transactions/purchase"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','CLIENTE']}>
            <PurchaseForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="transactions/credit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','CAJERO']}>
            <CreditForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="transactions/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','GERENTE_SUCURSAL']}>
            <EditTxn />
          </ProtectedRoute>
        }
      />
      <Route
        path="transactions/:id/delete"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <DeleteTxn />
          </ProtectedRoute>
        }
      />

    </Routes>
  </main>
);
