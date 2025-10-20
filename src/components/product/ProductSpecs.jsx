import React from 'react';

function ProductSpecs({ variant }) {
  if (!variant) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
      {variant.ram && (
        <div className="bg-brand-dark/5 px-4 py-3 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">RAM</p>
          <p className="text-lg font-bold text-brand-dark">{variant.ram}GB</p>
        </div>
      )}
      {variant.storage && (
        <div className="bg-brand-dark/5 px-4 py-3 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">Almacenamiento</p>
          <p className="text-lg font-bold text-brand-dark">{variant.storage}GB</p>
        </div>
      )}
      {variant.color && (
        <div className="bg-brand-dark/5 px-4 py-3 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">Color</p>
          <p className="text-lg font-bold text-brand-dark capitalize">{variant.color}</p>
        </div>
      )}
    </div>
  );
}

export default ProductSpecs;
