import React, { useState } from 'react';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    setFormData({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Contacto
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600">
            ¿Tienes alguna pregunta? ¡Contáctanos!
          </p>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Información de Contacto */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-4 sm:mb-6">
              Información de Contacto
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl">📍</span>
                  <div>
                    <strong className="block text-base sm:text-lg font-semibold text-gray-800">Dirección:</strong>
                    <p className="text-sm sm:text-base text-gray-600">Av. Principal 123, Ciudad, País</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl">📞</span>
                  <div>
                    <strong className="block text-base sm:text-lg font-semibold text-gray-800">Teléfono:</strong>
                    <p className="text-sm sm:text-base text-gray-600">+1 234 567 890</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl">✉️</span>
                  <div>
                    <strong className="block text-base sm:text-lg font-semibold text-gray-800">Email:</strong>
                    <p className="text-sm sm:text-base text-gray-600">info@techcellstore.com</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl">🕐</span>
                  <div>
                    <strong className="block text-base sm:text-lg font-semibold text-gray-800">Horario:</strong>
                    <p className="text-sm sm:text-base text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-sm sm:text-base text-gray-600">Sábados: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Formulario de Contacto */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-4 sm:mb-6">
              Envíanos un mensaje
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label 
                  htmlFor="nombre" 
                  className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
                >
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 transition-colors duration-300 text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 transition-colors duration-300 text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label 
                  htmlFor="mensaje" 
                  className="block text-sm sm:text-base font-semibold text-gray-700 mb-2"
                >
                  Mensaje:
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 transition-colors duration-300 resize-none text-sm sm:text-base"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;
