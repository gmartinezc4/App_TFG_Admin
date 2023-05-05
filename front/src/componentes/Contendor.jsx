import React, { useContext, useEffect } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Context } from "../context/Context";
import IniciarSesion from "./IniciarSesion";
import MenuLateral from "./MenuLateral";
import styled from "styled-components";
import PantallaPrincipal from "./PantallaPrincipal";
import Cabecera from "./Cabecera";
import ForgotPassword from "./ForgotPassword";
import ForgotPassword2 from "./ForgotPassword2";

function Contendor() {
  const client = new ApolloClient({
    uri: "http://localhost:4001/",
    cache: new InMemoryCache(),
  });
  //localStorage.removeItem("token");

  const { token, reload, viewRecuperarPass1, viewRecuperarPass2 } = useContext(Context);

  useEffect(() => {
  }, [reload])
  
  
  return (
    <ApolloProvider client={client}>
      <div className="">
        <div>
          <Cabecera />
        </div>

        {!token && (
          <div>
            <ColorPantallaPrincipal>
              {!viewRecuperarPass1 && !viewRecuperarPass2 && <IniciarSesion />}
            </ColorPantallaPrincipal>
            <div className="bg-gray-300 h-screen">
              {viewRecuperarPass1 && <ForgotPassword />}
              {viewRecuperarPass2 && <ForgotPassword2 />}
            </div>
          </div>
        )}
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
