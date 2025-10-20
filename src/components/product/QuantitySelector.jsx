import React from 'react';

function QuantitySelector({ quantity, setQuantity, maxStock }) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark mb-2">
        Cantidad
      </label>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-12 h-12 rounded-lg bg-brand-dark/10 hover:bg-brand-dark/20 text-brand-dark font-bold transition-colors"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="text-2xl font-bold text-brand-dark w-12 text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
          className="w-12 h-12 rounded-lg bg-brand-dark/10 hover:bg-brand-dark/20 text-brand-dark font-bold transition-colors"
          disabled={quantity >= maxStock}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default QuantitySelector;
