import React from 'react';
import ProductBadges from './ProductBadges';
import ProductSpecs from './ProductSpecs';
import SellerInfo from './SellerInfo';
import ProductPrice from './ProductPrice';
import ProductActions from './ProductActions';

function ProductDetails({ 
  product, 
  hasDiscount, 
  isAvailable,
  quantity,
  setQuantity,
  handleAddToCart,
  addingToCart
}) {
  return (
    <div className="p-8 sm:p-10 lg:p-12">
      <ProductBadges product={product} hasDiscount={hasDiscount} />

      {product.brand && (
        <p className="text-lg font-bold text-brand-contrast mb-2">
          {product.brand.name}
        </p>
      )}

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-4 leading-tight">
        {product.variant?.model?.modelName || `Producto #${product.id}`}
      </h1>

      <ProductSpecs variant={product.variant} />

      <SellerInfo seller={product.seller} />

      <ProductPrice product={product} hasDiscount={hasDiscount} />

      <ProductActions 
        isAvailable={isAvailable}
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        handleAddToCart={handleAddToCart}
        addingToCart={addingToCart}
      />
    </div>
  );
}

export default ProductDetails;
