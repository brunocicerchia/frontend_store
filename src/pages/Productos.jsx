import React from 'react';
import ProductList from '../components/ProductList';

function Productos() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header Minimalista */}
        <div className="mb-12 sm:mb-16">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-contrast/10 border border-brand-contrast/30 text-brand-contrast text-xs sm:text-sm font-medium tracking-wide">
              CATÁLOGO
            </span>
          </div>
          
          {/* Título */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-light mb-4 text-center leading-tight tracking-tight">
            Nuestros Productos
          </h1>
          
          {/* Subtítulo */}
          <p className="text-base sm:text-lg md:text-xl text-brand-light-400 text-center max-w-2xl mx-auto font-light">
            Explora nuestra selección de celulares
          </p>
        </div>
        
        {/* ProductList Component */}
        <ProductList />
      </div>
    </div>
  );
}

export default Productos;
