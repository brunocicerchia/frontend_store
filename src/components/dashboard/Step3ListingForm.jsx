import React from 'react';

export default function Step3ListingForm({ 
  mySeller,
  listingFormData,
  onFormChange,
  onSubmit, 
  onBack 
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-brand-dark mb-2">
          Paso 3: Configura el Listing
        </h2>
        <p className="text-gray-600 mb-6">
          Define el precio y stock para tu producto
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Seller Info Display */}
        {mySeller && (
          <div className="bg-gradient-to-r from-brand-contrast/10 to-brand-button/10 border-2 border-brand-contrast/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-contrast rounded-full flex items-center justify-center text-white text-xl font-bold">
                {mySeller.shopName?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Vendedor</p>
                <p className="text-lg font-bold text-brand-dark">{mySeller.shopName}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              Precio ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={listingFormData.price}
              onChange={(e) => onFormChange({ ...listingFormData, price: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-brand-contrast transition-all"
              placeholder="899.99"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              Stock (unidades)
            </label>
            <input
              type="number"
              value={listingFormData.stock}
              onChange={(e) => onFormChange({ ...listingFormData, stock: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-brand-contrast transition-all"
              placeholder="10"
              required
            />
          </div>
        </div>

        <div className="flex items-center bg-gray-50 p-4 rounded-lg">
          <input
            type="checkbox"
            checked={listingFormData.active}
            onChange={(e) => onFormChange({ ...listingFormData, active: e.target.checked })}
            className="w-5 h-5 text-brand-contrast focus:ring-brand-contrast rounded"
          />
          <label className="ml-3 text-sm font-medium text-brand-dark">
            Activar listing inmediatamente
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            ← Atrás
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-brand-contrast to-brand-button text-white py-3 px-6 rounded-lg font-bold hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Crear Producto
          </button>
        </div>
      </form>
    </div>
  );
}
