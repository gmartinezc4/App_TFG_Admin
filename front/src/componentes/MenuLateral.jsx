import React, { useContext } from "react";
import { Context } from "../context/Context";

function MenuLateral() {
  const {
    nivel_auth,
    changeViewRegistro,
    changeViewUsuarios,
    changeViewTodosPedidos,
    changeViewProductosWeb,
    changeViewMaderasWeb,
    viewRegistro,
    viewUsuarios,
    viewTodosPedidos,
    viewProductosWeb,
    viewMaderasWeb,
  } = useContext(Context);

  return (
    <div className="flex flex-row justify-around  text-white">
      <div className="flex justify-center">
        <span className="flex flex-col mt-3 ml-5">
          <h1 className="flex justify-center mb-10 text-2xl font-bold underline">Menu</h1>

          <button
            className={
              viewUsuarios
                ? "flex justify-start text-orange-500 underline mb-5"
                : "flex justify-start hover:text-orange-500 mb-5"
            }
            onClick={() => {
              changeViewUsuarios(true);
            }}
          >
            • Usuarios
          </button>
          <button
            className={
              viewTodosPedidos
                ? "flex justify-start text-orange-500 underline mb-5"
                : "flex justify-start hover:text-orange-500 mb-5"
            }
            onClick={() => {
              changeViewTodosPedidos(true);
            }}
          >
            • Pedidos
          </button>
          <button
            className={
              viewProductosWeb
                ? "flex justify-start text-orange-500 underline mb-5"
                : "flex justify-start hover:text-orange-500 mb-5"
            }
            onClick={() => {
              changeViewProductosWeb(true);
            }}
          >
            • Productos
          </button>
          <button
            className={
              viewMaderasWeb
                ? "flex justify-start text-orange-500 underline mb-5"
                : "flex justify-start hover:text-orange-500 mb-5"
            }
            onClick={() => {
              changeViewMaderasWeb(true);
            }}
          >
            • Maderas
          </button>
          <div className="flex justify-start mb-5">
            {nivel_auth >= 2 && (
              <button
                className={
                  viewRegistro
                    ? "flex justify-start text-orange-500 underline mb-5"
                    : "flex justify-start hover:text-orange-500 mb-5"
                }
                onClick={() => {
                  changeViewRegistro(true);
                }}
              >
                • Registrar administrador
              </button>
            )}
          </div>
        </span>
      </div>
    </div>
  );
}

export default MenuLateral;
