import React, { createContext, useState } from "react";

export const Context = createContext(); //contexto

export function ContextProvider(props) {
  const [viewRegistro, setViewRegistro] = useState(false);
  
  const [reload, setReload] = useState(false);

  const token = localStorage.getItem("token");
  const nivel_auth = localStorage.getItem("nivel_auth");
  
  function changeReload(){
    setReload(!reload);
  }

  function changeViewRegistro(setView){
    setViewRegistro(setView);
  }

  return (
    <Context.Provider
      value={{
        token,
        nivel_auth,
        viewRegistro,

        changeReload,
        changeViewRegistro,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
