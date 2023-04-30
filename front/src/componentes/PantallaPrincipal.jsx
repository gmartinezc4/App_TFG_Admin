import React, { useContext } from 'react'
import RegistrarAdmin from './RegistrarAdmin'
import { Context } from "../context/Context";

function PantallaPrincipal() {
    const { viewRegistro } = useContext(Context);

  return (
    <div>
      <div className='flex justify-center '>{viewRegistro && <RegistrarAdmin />}</div>
    </div>
  );
}

export default PantallaPrincipal