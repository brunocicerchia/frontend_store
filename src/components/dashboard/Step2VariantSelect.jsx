import React from 'react';

export default function Step2VariantSelect({ 
  variants, 
  selectedModelId,
  selectedVariantId, 
  useExistingVariant,
  variantFormData,
  onVariantSelect,
  onToggleExisting,
  onFormChange,
  onNext, 
  onBack 
}) {
  const filteredVariants = variants.filter(v => v.deviceModelId === parseInt(selectedModelId));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-brand-dark mb-2">
          Paso 2: Configura la Variante
        </h2>
        <p className="text-gray-600 mb-6">
          Selecciona una variante existente o crea una nueva con especificaciones únicas
        </p>
      </div>

      {/* Toggle between existing/new */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => onToggleExisting(true)}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            useExistingVariant
              ? 'bg-brand-contrast text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Usar Variante Existente
        </button>
        <button
          onClick={() => onToggleExisting(false)}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            !useExistingVariant
              ? 'bg-brand-contrast text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Crear Nueva Variante
        </button>
      </div>

      {useExistingVariant ? (
        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto p-2">
          {filteredVariants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onVariantSelect(variant.id)}
              className={`text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                selectedVariantId === variant.id
                  ? 'border-brand-contrast bg-brand-contrast/10 shadow-lg'
                  : 'border-gray-200 hover:border-brand-contrast/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-brand-dark mb-1">
                    {variant.ram}GB RAM / {variant.storage}GB
                  </p>
                  <p className="text-gray-600">Color: {variant.color}</p>
                  <span className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                    variant.condition === 'NEW' ? 'bg-blue-100 text-blue-700' :
                    variant.condition === 'REFURB' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {variant.condition === 'NEW' ? 'Nuevo' :
                     variant.condition === 'REFURB' ? 'Reacondicionado' : 'Usado'}
                  </span>
                </div>
                {selectedVariantId === variant.id && (
                  <div className="text-brand-contrast text-2xl">✓</div>
                )}
              </div>
            </button>
          ))}
          {filteredVariants.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No hay variantes para este modelo. Crea una nueva.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                RAM (GB)
              </label>
              <input
                type="number"
                value={variantFormData.ram}
                onChange={(e) => onFormChange({ ...variantFormData, ram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-transparent"
                placeholder="8"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                Almacenamiento (GB)
              </label>
              <input
                type="number"
                value={variantFormData.storage}
                onChange={(e) => onFormChange({ ...variantFormData, storage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-transparent"
                placeholder="256"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-2">
              Color
            </label>
            <input
              type="text"
              value={variantFormData.color}
              onChange={(e) => onFormChange({ ...variantFormData, color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-transparent"
              placeholder="Phantom Black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-2">
              Condición
            </label>
            <select
              value={variantFormData.condition}
              onChange={(e) => onFormChange({ ...variantFormData, condition: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-transparent"
            >
              <option value="NEW">Nuevo</option>
              <option value="REFURB">Reacondicionado</option>
              <option value="USED">Usado</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={useExistingVariant ? !selectedVariantId : (!variantFormData.ram || !variantFormData.storage || !variantFormData.color)}
          className="flex-1 bg-brand-contrast text-brand-light py-3 px-6 rounded-lg font-semibold hover:bg-brand-contrast-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
