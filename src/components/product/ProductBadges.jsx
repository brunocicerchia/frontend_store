import React from 'react';

function ProductBadges({ product, hasDiscount }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {product.stock > 0 ? (
        <span className="inline-block bg-green-500/10 text-green-600 text-sm font-semibold px-4 py-1.5 rounded-full">
          En Stock ({product.stock} disponibles)
        </span>
      ) : (
        <span className="inline-block bg-red-500/10 text-red-600 text-sm font-semibold px-4 py-1.5 rounded-full">
          Sin Stock
        </span>
      )}

      {product.variant?.condition && (
        <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full ${
          product.variant.condition === 'NEW' ? 'bg-blue-500/10 text-blue-600' :
          product.variant.condition === 'REFURB' ? 'bg-yellow-500/10 text-yellow-600' :
          'bg-gray-500/10 text-gray-600'
        }`}>
          {product.variant.condition === 'NEW' ? 'Nuevo' : 
           product.variant.condition === 'REFURB' ? 'Reacondicionado' : 
           'Usado'}
        </span>
      )}

      {hasDiscount && (
        <span className="inline-block bg-brand-contrast/10 text-brand-contrast text-sm font-semibold px-4 py-1.5 rounded-full">
          🎉 ¡Descuento!
        </span>
      )}
    </div>
  );
}

export default ProductBadges;
