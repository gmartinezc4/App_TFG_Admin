import React, { useContext, useEffect } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Context } from "../context/Context";
import IniciarSesion from "./IniciarSesion";
import MenuLateral from "./MenuLateral";
import styled from "styled-components";
import PantallaPrincipal from "./PantallaPrincipal";
import Cabecera from "./Cabecera";
import PaginasErrores from "./PaginasErrores";


//
// * Componente contenedor de todos los demás componentes.
// * Desde aqui se renderiazan los demás componentes de la web.
//
function Contendor() {
  const client = new ApolloClient({
    uri: "http://localhost:4001/",
    cache: new InMemoryCache(),
  });

  //Variables de contexto usadas
  const { token, reload, viewError, codigoError, mensajeError } = useContext(Context);

  useEffect(() => {
  }, [reload])
  
  
  return (
    <ApolloProvider client={client}>
      <div>
        {viewError && <PaginasErrores codigo={codigoError} mensaje={mensajeError} />}
        <div>
          <Cabecera />
        </div>

        {/* Si no hay token */}
        {!token && (
          <ColorPantallaPrincipal>
            <IniciarSesion />
          </ColorPantallaPrincipal>
        )}

        {/* Si hay token */}
        {token && (
          <div className="flex flex-row">
            <ColorMenu className="w-64 flex flex-row">
              <MenuLateral />
            </ColorMenu>

            <ColorPantallaPrincipal className="w-screen">
              <PantallaPrincipal />
            </ColorPantallaPrincipal>
          </div>
        )}
      </div>
    </ApolloProvider>
  );
}

export default Contendor;

const ColorPantallaPrincipal = styled.div`
  background-color: rgb(209 213 219);
  height: auto;
`;

const ColorMenu = styled.div`
  background-color: rgb(75 85 99);
  height: 100vh;
`;
