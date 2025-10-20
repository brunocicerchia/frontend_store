import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <section className="mb-16 sm:mb-20 lg:mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6 sm:mb-8">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-contrast/10 border border-brand-contrast/30 text-brand-contrast text-xs sm:text-sm font-medium tracking-wide">
                PERSONAL • CLARO • MOVISTAR
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-light mb-6 sm:mb-8 text-center leading-tight tracking-tight">
              Bienvenido a<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-contrast to-brand-alt">
                PhoneCenter
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-brand-light-400 text-center max-w-2xl mx-auto mb-8 sm:mb-12 font-light leading-relaxed">
              El portal multioperadora de argentina.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/productos')}
                className="w-full sm:w-auto bg-brand-contrast text-brand-light px-8 py-3.5 rounded-lg font-medium hover:bg-brand-contrast-600 transition-all duration-300 hover:shadow-lg hover:shadow-brand-contrast/30 hover:-translate-y-0.5"
              >
                Explorar Productos
              </button>
              <button 
                onClick={() => navigate('/contacto')}
                className="w-full sm:w-auto border-2 border-brand-light/20 text-brand-light px-8 py-3.5 rounded-lg font-medium hover:bg-brand-light/5 hover:border-brand-light/40 transition-all duration-300"
              >
                Contacto
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
