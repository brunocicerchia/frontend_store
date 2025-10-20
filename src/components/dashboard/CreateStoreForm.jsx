import React, { useState } from 'react';

export default function CreateStoreForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState({
    shopName: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSuccess(formData);
    } catch (error) {
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-contrast rounded-full mb-4">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-4xl font-bold text-brand-light mb-3">
            ¡Bienvenido!
          </h1>
          <p className="text-brand-light-400 text-lg">
            Antes de comenzar, necesitamos que crees tu tienda
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-brand-light rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">
              Crear Mi Tienda
            </h2>
            <p className="text-gray-600">
              Esta información será visible para los compradores
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Nombre de la Tienda *
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-brand-contrast transition-all"
                placeholder="Ej: TechStore Argentina"
                required
                minLength={3}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 3 caracteres, máximo 100
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-brand-contrast transition-all resize-none"
                placeholder="Ej: Especialistas en smartphones de última generación"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                Máximo 500 caracteres
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="text-blue-500 text-xl">ℹ️</div>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>El nombre de tu tienda será visible en todos tus productos</li>
                    <li>Podrás modificar esta información más adelante</li>
                    <li>Los compradores verán tu descripción al visitar tus productos</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.shopName.trim()}
              className="w-full bg-gradient-to-r from-brand-contrast to-brand-button text-white py-4 px-6 rounded-lg font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creando tienda...
                </span>
              ) : (
                'Crear Mi Tienda'
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-brand-light-400 text-sm mt-6">
          Una vez creada tu tienda, podrás comenzar a publicar productos
        </p>
      </div>
    </div>
  );
}
