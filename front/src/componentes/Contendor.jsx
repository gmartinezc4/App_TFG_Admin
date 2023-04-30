import React, { useContext } from 'react'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Context } from '../context/Context'
import IniciarSesion from './IniciarSesion';
import MenuLateral from './MenuLateral';
import RegistrarAdmin from './RegistrarAdmin';
import PantallaPrincipal from './PantallaPrincipal';

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
        {token && (
          <div className='flex flex-row'>
            <div className="w-72">
              <MenuLateral />
            </div>

            <div className="w-screen">
                <PantallaPrincipal /> 
            </div>
          </div>
        )}
      </div>
    </ApolloProvider>
  );
}

export default Contendor;