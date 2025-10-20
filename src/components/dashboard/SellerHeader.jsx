import React from 'react';

export default function SellerHeader({ seller, productCount }) {
  if (!seller) return null;

  return (
    <div className="bg-brand-light rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-contrast to-brand-button rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {seller.shopName?.charAt(0) || 'S'}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tienda</p>
            <h2 className="text-2xl font-bold text-brand-dark">{seller.shopName}</h2>
            {seller.description && (
              <p className="text-sm text-gray-600 mt-1">{seller.description}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Tus productos</p>
          <p className="text-3xl font-bold text-brand-contrast">
            {productCount}
          </p>
        </div>
      </div>
    </div>
  );
}
