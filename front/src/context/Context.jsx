import React, { createContext, useState } from "react";

export const Context = createContext(); //contexto

export function ContextProvider(props) {
  
  
  const [reload, setReload] = useState(false);

  const token = localStorage.getItem("token");
  
  function changeReload(){
    setReload(!reload);
  }

  return (
    <Context.Provider
      value={{
        token,

        changeReload,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
