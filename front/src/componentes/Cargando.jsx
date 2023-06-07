import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// 
// * Componente para mostrar el icono de cargando.
// 
function Cargando() {
  return (
    <div className="flex justify-center">
        <AiOutlineLoading3Quarters className="w-52 h-52 animate-spin mt-52"/>
    </div>
  );
}

export default Cargando;
