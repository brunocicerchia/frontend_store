import React from 'react';

export default function Step1ModelSelect({ 
  models,
  brands,
  selectedModelId,
  useExistingModel,
  modelFormData,
  onModelSelect,
  onToggleExisting,
  onFormChange,
  onNext, 
  onCancel 
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-brand-dark mb-2">
          Paso 1: Selecciona el Modelo
        </h2>
        <p className="text-gray-600 mb-6">
          Elige un modelo existente o crea uno nuevo
        </p>
      </div>

      {/* Toggle between existing/new */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => onToggleExisting(true)}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            useExistingModel
              ? 'bg-brand-contrast text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Usar Modelo Existente
        </button>
        <button
          onClick={() => onToggleExisting(false)}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            !useExistingModel
              ? 'bg-brand-contrast text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Crear Nuevo Modelo
        </button>
      </div>

      {useExistingModel ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-3">
              Selecciona un modelo existente
            </label>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto p-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => onModelSelect(model.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedModelId === model.id
                      ? 'border-brand-contrast bg-brand-contrast/10 shadow-lg'
                      : 'border-gray-200 hover:border-brand-contrast/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-dark">{model.brandName}</p>
                      <p className="text-gray-600">{model.modelName}</p>
                    </div>
                    {selectedModelId === model.id && (
                      <div className="text-brand-contrast text-2xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
              {models.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No hay modelos disponibles. Crea uno nuevo.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-2">
              Marca
            </label>
            <select
              value={modelFormData.brandId}
              onChange={(e) => onFormChange({ ...modelFormData, brandId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-transparent"
              required
            >
              <option value="">Seleccionar marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-2">
              Nombre del Modelo
            </label>
            <input
              type="text"
              value={modelFormData.modelName}
              onChange={(e) => onFormChange({ ...modelFormData, modelName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-contrast focus:border-transparent"
              placeholder="Galaxy S23 Ultra"
              required
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onNext}
          disabled={useExistingModel ? !selectedModelId : (!modelFormData.brandId || !modelFormData.modelName)}
          className="flex-1 bg-brand-contrast text-brand-light py-3 px-6 rounded-lg font-semibold hover:bg-brand-contrast-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
