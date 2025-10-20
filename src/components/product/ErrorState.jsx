import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorState({ error }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700 flex justify-center items-center py-20">
      <div className="text-center bg-brand-light rounded-xl p-10 shadow-lg max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-brand-dark text-2xl font-bold mb-2">Error</h2>
        <p className="text-brand-dark-400 mb-6">{error}</p>
        <button
          onClick={() => navigate('/productos')}
          className="bg-brand-contrast text-brand-light px-6 py-3 rounded-lg font-medium hover:bg-brand-contrast-600 transition-all duration-300"
        >
          Volver a Productos
        </button>
      </div>
    </div>
  );
}

export default ErrorState;
