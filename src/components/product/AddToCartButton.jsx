import React from 'react';

function AddToCartButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-brand-contrast text-brand-light py-4 px-8 rounded-lg font-bold text-lg hover:bg-brand-contrast-600 transition-all duration-300 hover:shadow-lg hover:shadow-brand-contrast/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {disabled ? 'Agregando...' : 'Agregar al Carrito'}
    </button>
  );
}

export default AddToCartButton;
