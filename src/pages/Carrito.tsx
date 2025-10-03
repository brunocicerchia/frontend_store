const Carrito = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
      <div className="text-center">
        <p className="text-lg text-gray-600">Tu carrito está vacío</p>
        <p className="text-gray-500 mt-2">
          ¡Agrega algunos productos para empezar!
        </p>
      </div>
    </div>
  );
};

export default Carrito;
