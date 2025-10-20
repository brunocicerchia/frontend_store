import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuantitySelector from './QuantitySelector';
import AddToCartButton from './AddToCartButton';

function ProductActions({ 
  isAvailable, 
  product, 
  quantity, 
  setQuantity, 
  handleAddToCart, 
  addingToCart 
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {isAvailable ? (
        <>
          <QuantitySelector 
            quantity={quantity}
            setQuantity={setQuantity}
            maxStock={product.stock}
          />
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={addingToCart}
          />
        </>
      ) : (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center mb-4">
          <p className="text-gray-600 font-semibold text-lg">
            Producto no disponible
          </p>
        </div>
      )}

      <button
        onClick={() => navigate('/productos')}
        className="w-full border-2 border-brand-dark/20 text-brand-dark py-3 px-6 rounded-lg font-medium hover:bg-brand-dark/5 hover:border-brand-dark/40 transition-all duration-300"
      >
        ← Volver a Productos
      </button>
    </div>
  );
}

export default ProductActions;
