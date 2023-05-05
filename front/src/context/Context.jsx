import React, { createContext, useState } from "react";

export const Context = createContext(); //contexto

export function ContextProvider(props) {
  const [viewRegistro, setViewRegistro] = useState(false);
  const [viewUsuarios, setViewUsuarios] = useState(true);
  const [viewPedidosUser, setViewPedidosUser] = useState(false);
  const [viewProductosUser, setViewProductosUser] = useState(false);
  const [viewTodosPedidos, setViewTodosPedidos] = useState(false);
  const [viewProductosWeb, setViewProductosWeb] = useState(false);
  const [viewMaderasWeb, setViewMaderasWeb] = useState(false);
  const [viewPerfilAdmin, setViewPerfilAdmin] = useState(false);
  const [viewRecuperarPass1, setViewRecuperarPass1] = useState(false);
  const [viewRecuperarPass2, setViewRecuperarPass2] = useState(false);

  const [emailUserRecuperaPass, setEmailUserRecuperaPass] = useState("");
  const [enviarCorreoConfirmacion, setEnviarCorreoConfirmacion] = useState(false);
  const [volverDeProductos, setVolverDeProductos] = useState("");
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
    setViewTodosPedidos(false);
    setViewProductosWeb(false);
    setViewMaderasWeb(false);
    setViewPerfilAdmin(false);
  }

  function changeViewUsuarios(setView){
    setViewUsuarios(setView);
    setViewRegistro(false);
    setViewPedidosUser(false);
    setViewProductosUser(false);
    setViewTodosPedidos(false);
    setViewProductosWeb(false);
    setViewMaderasWeb(false);
    setViewPerfilAdmin(false);
  }

  function changeViewPedidosUser(setView){
    setViewPedidosUser(setView);
    setViewUsuarios(false);
    setViewRegistro(false);
    setViewProductosUser(false);
    setViewTodosPedidos(false);
    setViewProductosWeb(false);
    setViewMaderasWeb(false);
    setViewPerfilAdmin(false);
  }

  function changeViewProductosUser(setView){
    setViewProductosUser(setView);
    setViewRegistro(false);
    setViewUsuarios(false);
    setViewPedidosUser(false);
    setViewTodosPedidos(false);
    setViewProductosWeb(false);
    setViewMaderasWeb(false);
    setViewPerfilAdmin(false);
  }

  function changeViewTodosPedidos(setView){
    setViewTodosPedidos(setView);
    setViewRegistro(false);
    setViewUsuarios(false);
    setViewPedidosUser(false);
    setViewProductosUser(false);
    setViewProductosWeb(false);
    setViewMaderasWeb(false);
    setViewPerfilAdmin(false);
  }

  function changeViewProductosWeb(setView){
    setViewProductosWeb(setView);
    setViewRegistro(false);
    setViewUsuarios(false);
    setViewPedidosUser(false);
    setViewProductosUser(false);
    setViewTodosPedidos(false);
    setViewMaderasWeb(false);
    setViewPerfilAdmin(false);
  }

  function changeViewMaderasWeb(setView){
    setViewMaderasWeb(setView);
    setViewRegistro(false);
    setViewUsuarios(false);
    setViewPedidosUser(false);
    setViewProductosUser(false);
    setViewTodosPedidos(false);
    setViewProductosWeb(false);
    setViewPerfilAdmin(false);
  }

  function changeViewPerfilAdmin(setView){
    setViewPerfilAdmin(setView);
    setViewRegistro(false);
    setViewUsuarios(false);
    setViewPedidosUser(false);
    setViewProductosUser(false);
    setViewTodosPedidos(false);
    setViewProductosWeb(false);
    setViewMaderasWeb(false);
  }

  function verInicioSesion(){
    setViewRegistro(false);
    setViewUsuarios(false);
    setViewPedidosUser(false);
    setViewProductosUser(false);
    setViewTodosPedidos(false);
    setViewProductosWeb(false);
    setViewMaderasWeb(false);
    setViewPerfilAdmin(false);
  }

  function changeEmailUserRecuperaPass(setEmail){
    setEmailUserRecuperaPass(setEmail);
  }

  function changeViewRecuperarPass1(setView){
    setViewRecuperarPass1(setView);
  }

  function changeViewRecuperarPass2(setView){
    setViewRecuperarPass2(setView)
  }

  function changeEnviarCorreoConfirmacion(setView){
    setEnviarCorreoConfirmacion(setView);
  }

  function changeVolverDeProductos(setVolver){
    setVolverDeProductos(setVolver);
  }

  return (
    <Context.Provider
      value={{
        viewRegistro,
        viewUsuarios,
        viewPedidosUser,
        viewProductosUser,
        viewTodosPedidos,
        viewProductosWeb,
        viewMaderasWeb,
        viewPerfilAdmin,
        viewRecuperarPass1,
        viewRecuperarPass2,
        
        emailUserRecuperaPass,
        enviarCorreoConfirmacion,
        volverDeProductos,
        reload,
        token,
        nivel_auth,
        
        changeViewRegistro,
        changeViewUsuarios,
        changeViewPedidosUser,
        changeViewProductosUser,
        changeViewTodosPedidos,
        changeViewProductosWeb,
        changeViewMaderasWeb,
        changeViewPerfilAdmin,
        changeViewRecuperarPass1,
        changeViewRecuperarPass2,

        changeEmailUserRecuperaPass,
        verInicioSesion,
        changeEnviarCorreoConfirmacion,
        changeVolverDeProductos,
        changeReload,
        
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
