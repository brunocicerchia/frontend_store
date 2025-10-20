import React from 'react';

function Nosotros() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Sobre Nosotros
          </h1>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 space-y-8 sm:space-y-12">
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500">
              Nuestra Historia
            </h2>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Nosotros;
