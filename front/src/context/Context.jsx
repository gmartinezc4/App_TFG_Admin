import React, { createContext, useState } from "react";

export const Context = createContext(); //contexto

export function ContextProvider(props) {
  const [viewRegistro, setViewRegistro] = useState(false);
  const [viewUsuarios, setViewUsuarios] = useState(false);
  const [viewPedidosUser, setViewPedidosUser] = useState(false);
  const [viewProductosUser, setViewProductosUser] = useState(false);
  
  const [reload, setReload] = useState(false);

  const token = localStorage.getItem("token");
  const nivel_auth = localStorage.getItem("nivel_auth");
  
  function changeReload(){
    setReload(!reload);
  }

  function changeViewRegistro(setView){
    setViewRegistro(setView);
    setViewUsuarios(false);
    setViewPedidosUser(false);
    setViewProductosUser(false);
  }

  function changeViewUsuarios(setView){
    setViewUsuarios(setView);
    setViewRegistro(false);
    setViewPedidosUser(false);
    setViewProductosUser(false);
  }

  function changeViewPedidosUser(setView){
    setViewPedidosUser(setView);
    setViewUsuarios(false);
    setViewRegistro(false);
    setViewProductosUser(false);
  }

  function changeViewProductosUser(setView){
    setViewProductosUser(setView);
    setViewRegistro(false);
    setViewUsuarios(false);
    setViewPedidosUser(false);
  }

  return (
    <Context.Provider
      value={{
        token,
        nivel_auth,
        reload,
        viewRegistro,
        viewUsuarios,
        viewPedidosUser,
        viewProductosUser,

        changeReload,
        changeViewRegistro,
        changeViewUsuarios,
        changeViewPedidosUser,
        changeViewProductosUser,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
