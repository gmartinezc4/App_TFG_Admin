import React, { useContext } from 'react'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Context } from '../context/Context'
import IniciarSesion from './IniciarSesion';

function Contendor() {
  const client = new ApolloClient({
    uri: "http://localhost:4001/",
    cache: new InMemoryCache(),
  });
  //localStorage.removeItem("token");

  const { token } = useContext(Context);

  return (
    <ApolloProvider client={client}>
      <div>
        {!token && <IniciarSesion />}
        {token && <div>Contenedor</div>}
      </div>
    </ApolloProvider>
  );
}

export default Contendor;