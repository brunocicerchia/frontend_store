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
          {/* Nuestra Historia */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-contrast">
              📱 Nuestra Historia
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              PixelPoint nació en 2025 con una misión clara: revolucionar el mercado de dispositivos 
              electrónicos en América Latina. Somos un marketplace moderno que conecta vendedores 
              confiables con compradores que buscan la mejor tecnología a precios competitivos.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Lo que comenzó como un pequeño proyecto entre amigos apasionados por la tecnología, 
              se ha convertido en una plataforma robusta que procesa cientos de transacciones 
              diarias, garantizando seguridad, transparencia y la mejor experiencia de compra.
            </p>
          </section>

          {/* Nuestra Misión */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-contrast">
              🎯 Nuestra Misión
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Democratizar el acceso a tecnología de calidad mediante una plataforma segura, 
              intuitiva y confiable. Creemos que todos merecen acceso a dispositivos modernos 
              sin complicaciones, con precios justos y garantía de autenticidad.
            </p>
          </section>

          {/* Nuestros Valores */}
          <section className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-contrast">
              ⭐ Nuestros Valores
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div className="bg-gradient-to-br from-brand-light-100 to-brand-light-200 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-brand-dark mb-2">🔒 Confianza</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Verificamos cada vendedor y producto para garantizar transacciones 100% seguras.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-brand-light-100 to-brand-light-200 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-brand-dark mb-2">💡 Innovación</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Utilizamos tecnología de punta para ofrecer la mejor experiencia de compra online.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-brand-light-100 to-brand-light-200 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-brand-dark mb-2">🤝 Transparencia</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Sin costos ocultos. Precios claros y condiciones transparentes en cada compra.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-brand-light-100 to-brand-light-200 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-brand-dark mb-2">🚀 Excelencia</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Nos esforzamos por superar las expectativas en cada interacción con nuestros usuarios.
                </p>
              </div>
            </div>
          </section>

          {/* Por Qué Elegirnos */}
          <section className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-contrast">
              💎 ¿Por Qué Elegirnos?
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-brand-contrast text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1">Variedad Incomparable</h4>
                  <p className="text-sm sm:text-base text-gray-700">
                    Miles de productos de las mejores marcas: Samsung, Apple, Xiaomi, y más.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-brand-contrast text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1">Precios Competitivos</h4>
                  <p className="text-sm sm:text-base text-gray-700">
                    Comparamos precios de múltiples vendedores para que encuentres las mejores ofertas.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-brand-contrast text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1">Compra Segura</h4>
                  <p className="text-sm sm:text-base text-gray-700">
                    Sistema de pagos encriptado y protección al comprador en cada transacción.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-brand-contrast text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1">Soporte 24/7</h4>
                  <p className="text-sm sm:text-base text-gray-700">
                    Nuestro equipo está disponible para ayudarte en cualquier momento.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Estadísticas */}
          <section className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-contrast text-center">
              📊 Nuestros Números
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-brand-dark-100 to-brand-dark-200 rounded-xl">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-contrast mb-2">
                  10K+
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                  Usuarios Activos
                </div>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-brand-dark-100 to-brand-dark-200 rounded-xl">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-contrast mb-2">
                  500+
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                  Vendedores Verificados
                </div>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-brand-dark-100 to-brand-dark-200 rounded-xl">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-contrast mb-2">
                  50K+
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                  Productos Disponibles
                </div>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-brand-dark-100 to-brand-dark-200 rounded-xl">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-contrast mb-2">
                  98%
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                  Satisfacción Cliente
                </div>
              </div>
            </div>
          </section>

          {/* Llamado a la Acción */}
          <section className="text-center pt-4 sm:pt-8 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              ¿Listo para encontrar tu próximo dispositivo?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
              Únete a miles de usuarios que ya confían en PixelPoint
            </p>
            <a
              href="/productos"
              className="inline-block bg-brand-contrast hover:bg-brand-contrast-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explorar Productos 🚀
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Nosotros;
