import React from 'react';
import ImageUploader from './ImageUploader';

export default function EditListingModal({ 
  listing, 
  onUpdate, 
  onCancel 
}) {
  const [formData, setFormData] = React.useState({
    price: listing.price || '',
    stock: listing.stock || '',
    active: listing.active !== undefined ? listing.active : true,
    discountType: listing.discountType || 'NONE',
    discountValue: listing.discountValue || 0,
    discountActive: listing.discountActive || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-light rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-brand-dark mb-2">
            ✏️ Editar Producto
          </h2>
          <p className="text-gray-600">
            Modifica el precio, stock o estado de activación
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info Display */}
          <div className="bg-gradient-to-r from-brand-button/10 to-brand-contrast/10 border-2 border-brand-contrast/20 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-contrast rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                📱
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Producto</p>
                <p className="text-lg font-bold text-brand-dark">
                  {listing.brand?.name || 'N/A'} {listing.variant?.model?.modelName || ''}
                </p>
                <p className="text-sm text-gray-600">
                  {listing.variant?.ram}GB RAM / {listing.variant?.storage}GB - {listing.variant?.color}
                </p>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          {listing.seller && (
            <div className="bg-brand-light border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 font-medium mb-1">Vendedor</p>
              <p className="text-base font-semibold text-brand-dark">
                {listing.seller.shopName}
              </p>
            </div>
          )}

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Precio ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-brand-contrast transition-all"
                placeholder="10"
                required
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="editActive"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 text-brand-contrast focus:ring-brand-contrast rounded"
            />
            <label htmlFor="editActive" className="ml-3 text-sm font-medium text-brand-dark">
              Producto activo (visible en el catálogo)
            </label>
          </div>

          {/* Discount Section */}
          <div className="border-2 border-brand-contrast/20 rounded-lg p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
            <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
              🏷️ Descuentos
            </h3>

            <div className="space-y-4">
              {/* Discount Type */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Tipo de Descuento
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    discountType: e.target.value,
                    discountValue: e.target.value === 'NONE' ? 0 : formData.discountValue,
                    discountActive: e.target.value === 'NONE' ? false : formData.discountActive
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-brand-contrast transition-all"
                >
                  <option value="NONE">Sin descuento</option>
                  <option value="PERCENT">Porcentaje (%)</option>
                </select>
              </div>

              {/* Discount Value */}
              {formData.discountType !== 'NONE' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Porcentaje de Descuento (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-brand-contrast transition-all"
                      placeholder="10"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      El porcentaje debe estar entre 0 y 100
                    </p>
                  </div>

                  {/* Discount Active Toggle */}
                  <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="discountActive"
                      checked={formData.discountActive}
                      onChange={(e) => setFormData({ ...formData, discountActive: e.target.checked })}
                      className="w-5 h-5 text-brand-contrast focus:ring-brand-contrast rounded"
                    />
                    <label htmlFor="discountActive" className="ml-3 text-sm font-medium text-brand-dark">
                      Activar descuento
                    </label>
                  </div>

                  {/* Preview del precio con descuento */}
                  {formData.discountActive && formData.price && formData.discountValue > 0 && (
                    <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                      <p className="text-xs text-green-700 font-medium mb-1">Vista previa del precio:</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg line-through text-gray-500">
                          ${parseFloat(formData.price).toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-green-700">
                          ${(parseFloat(formData.price) - (parseFloat(formData.price) * parseFloat(formData.discountValue) / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-green-700 font-medium">
                          (-{formData.discountValue}%)
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Image Uploader */}
          {listing.variantId && (
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <ImageUploader variantId={listing.variantId} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-brand-contrast to-brand-button text-white py-3 px-6 rounded-lg font-bold hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              💾 Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
