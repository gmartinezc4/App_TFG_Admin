import React, { useContext } from "react";
import { Context } from "../context/Context";
import styled from 'styled-components'

function MenuLateral() {
  const {
    nivel_auth,
    changeViewRegistro,
    changeViewUsuarios,
    changeViewTodosPedidos,
    changeViewProductosWeb,
    changeViewMaderasWeb,
  } = useContext(Context);

  return (
    <ColorMenu className="flex flex-row justify-around  text-white">
      <div className="flex justify-center">
        <span className="flex flex-col mt-3 ml-5">
          <h1 className="flex justify-center mb-10 text-2xl font-bold underline">Menu</h1>
          <button
            className="flex justify-start underline mb-5"
            onClick={() => {
              changeViewUsuarios(true);
            }}
          >
            • Usuarios
          </button>
          <button
            className="flex justify-start underline mb-5"
            onClick={() => {
              changeViewTodosPedidos(true);
            }}
          >
            • Pedidos
          </button>
          <button
            className="flex justify-start underline mb-5"
            onClick={() => {
              changeViewProductosWeb(true);
            }}
          >
            • Productos
          </button>
          <button
            className="flex justify-start underline mb-5"
            onClick={() => {
              changeViewMaderasWeb(true);
            }}
          >
            • Maderas
          </button>
          <div className="flex justify-start underline mb-5">
            {nivel_auth >= 2 && (
              <button
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
    </ColorMenu>
  );
}

export default MenuLateral;

const ColorMenu = styled.div`
background-color: rgb(75 85 99);
height: 100%;
`