import React from 'react';

function SellerInfo({ seller }) {
  if (!seller) return null;

  return (
    <div className="bg-brand-alt/5 border border-brand-alt/20 rounded-lg p-4 mb-6">
      <p className="text-sm text-gray-600 mb-1">Vendido por</p>
      <p className="text-lg font-bold text-brand-alt">{seller.shopName}</p>
    </div>
  );
}

export default SellerInfo;
