import React, { createContext, useState } from "react";

export const Context = createContext(); //contexto

export function ContextProvider(props) {
  
  
  const [reload, setReload] = useState(false);

  const token = localStorage.getItem("token");
  const nivel_auth = localStorage.getItem("nivel_auth");
  
  function changeReload(){
    setReload(!reload);
  }

  return (
    <Context.Provider
      value={{
        token,
        nivel_auth,

        changeReload,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
