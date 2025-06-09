import React from 'react';

export const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-red-700 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Oops! La página que buscas no se encuentra.</p>
        <a
          href="/"
          className="text-lg font-medium bg-white text-gray-800 px-6 py-2 rounded-md shadow-lg hover:bg-gray-100 transition-all"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
