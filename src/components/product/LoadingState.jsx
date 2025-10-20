import React from 'react';

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700 flex justify-center items-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-brand-contrast mx-auto mb-6"></div>
        <p className="text-brand-light text-xl">Cargando producto...</p>
      </div>
    </div>
  );
}

export default LoadingState;
