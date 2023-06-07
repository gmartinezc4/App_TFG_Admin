import React, { useEffect } from 'react'

// 
// * Componente para mostrar pñagina de errores.
// 
function PaginasErrores(props) {

  useEffect(() => {
    if(props.mensaje == "Ha ocurrido un error con el usuario"){
      localStorage.removeItem("token");
    }
  }, [])
  
  return (
    <div className='text-6xl bg-white h-screen'>
        Error {props.codigo} <br></br>
        <div className='text-3xl'>
            {props.mensaje}
        </div>
    </div>
  )
}

export default PaginasErrores