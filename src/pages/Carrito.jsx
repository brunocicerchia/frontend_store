import React from 'react';

function Carrito() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header Minimalista */}
        <div className="mb-12 sm:mb-16">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-contrast/10 border border-brand-contrast/30 text-brand-contrast text-xs sm:text-sm font-medium tracking-wide">
              CARRITO
            </span>
          </div>
          
          {/* Título */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-light mb-4 text-center leading-tight tracking-tight">
            🛒 Carrito de Compras
          </h1>
        </div>
        
        {/* Carrito Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Carrito Vacío */}
          <div className="lg:col-span-2 bg-brand-light rounded-xl shadow-lg p-8 sm:p-12 text-center border-2 border-brand-contrast/20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">🛒</div>
              <p className="text-xl sm:text-2xl font-semibold text-brand-dark mb-4">
                Tu carrito está vacío
              </p>
              <p className="text-base sm:text-lg text-brand-dark-400 mb-6">
                ¡Agrega productos desde nuestra sección de Productos!
              </p>
              <button className="bg-brand-contrast text-brand-light px-6 py-3 rounded-lg font-medium hover:bg-brand-contrast-600 transition-all duration-300 hover:shadow-lg hover:shadow-brand-contrast/30">
                Ver Productos
              </button>
            </div>
          </div>
          
          {/* Resumen de Compra */}
          <div className="bg-brand-light rounded-xl shadow-lg p-6 sm:p-8 h-fit sticky top-20 border-2 border-brand-contrast/20">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-6">
              Resumen de compra
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-4 border-b border-brand-dark/10">
                <span className="text-base sm:text-lg text-brand-dark-400">Subtotal:</span>
                <span className="text-base sm:text-lg font-semibold text-brand-dark">$0</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-brand-dark/10">
                <span className="text-base sm:text-lg text-brand-dark-400">Envío:</span>
                <span className="text-base sm:text-lg font-semibold text-brand-contrast">Gratis</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg sm:text-xl font-bold text-brand-dark">Total:</span>
                <span className="text-lg sm:text-xl font-bold text-brand-button">$0</span>
              </div>
            </div>
            
            <button 
              disabled 
              className="w-full bg-brand-button text-brand-light font-semibold py-3 sm:py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-button-600 text-sm sm:text-base"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
