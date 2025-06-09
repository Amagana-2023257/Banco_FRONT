// src/components/users/DeactivateUserButton.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { useDeactivateUser } from '../../shared/hooks/useDeactivateUser';

export const DeactivateUserButton = ({ userId, onDeactivated }) => {
  const { deactivateUser, isLoading } = useDeactivateUser();

  const handleClick = async () => {
    const ok = await deactivateUser(userId);
    if (ok && onDeactivated) onDeactivated();
  };

  return (
    <Button
      variant="warning"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? 'Procesando...' : 'Desactivar'}
    </Button>
  );
};
