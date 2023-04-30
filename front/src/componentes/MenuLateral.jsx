import React from 'react'

function MenuLateral() {
  return (
    <div className="flex flex-row">
      <div className="flex justify-center">
        <span className="flex flex-col mt-3 ml-5">
          <h1 className="flex justify-center mb-10 text-2xl font-bold underline">
            Menu
          </h1>

          <button className="flex justify-start underline mb-5">
            • Usuarios
          </button>
          <button className="flex justify-start underline mb-5">
            • Maderas
          </button>
          <button className="flex justify-start underline mb-5">
            • Productos
          </button>
          <button className="flex justify-start underline mb-5">
            • Registrar administrador
          </button>
        </span>
      </div>

      <div className="border-gray-400 border h-screen ml-5"></div>
    </div>
  );
}

export default MenuLateral;