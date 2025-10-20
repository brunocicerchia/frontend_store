import React from 'react';

function ProductPrice({ product, hasDiscount }) {
  return (
    <div className="mb-8">
      {hasDiscount ? (
        <div>
          <p className="text-2xl text-gray-500 line-through mb-2">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-5xl sm:text-6xl font-bold text-brand-button">
            ${product.effectivePrice.toFixed(2)}
          </p>
          <p className="text-green-600 font-semibold mt-2">
            Ahorrás ${(product.price - product.effectivePrice).toFixed(2)}
          </p>
        </div>
      ) : (
        <p className="text-5xl sm:text-6xl font-bold text-brand-button">
          ${product.price.toFixed(2)}
        </p>
      )}
    </div>
  );
}

export default ProductPrice;
