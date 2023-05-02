import React, { useContext, useState } from "react";
import RegistrarAdmin from "./RegistrarAdmin";
import { Context } from "../context/Context";
import MostrarUsuarios from "./MostrarUsuarios";
import PedidosUser from "./PedidosUser";
import ProductosUser from "./ProductosUser";

function PantallaPrincipal() {
  const { viewRegistro, viewUsuarios, viewPedidosUser, viewProductosUser } = useContext(Context);
  const [idUser, setIdUser] = useState("");
  const [nombreUser, setNombreUser] = useState("");
  const [apellidoUser, setApellidoUser] = useState("");
  const [correoUser, setCorreoUser] = useState("");

  const [pedidoUser, setPedidoUser] = useState();
  

  function setDatosUser(idUser, nombreUser, apellidoUser, correoUser){
    setIdUser(idUser);
    setNombreUser(nombreUser);
    setApellidoUser(apellidoUser);
    setCorreoUser(correoUser);
  }

  return (
    <div>
      <div className="flex justify-center ">{viewRegistro && <RegistrarAdmin />}</div>
      <div className="m-10 ">
        {viewUsuarios && <MostrarUsuarios setDatosUser={setDatosUser} />}
      </div>
      <div className="m-10 ">
        {viewPedidosUser && (
          <PedidosUser
            idUser={idUser}
            nombreUser={nombreUser}
            apellidoUser={apellidoUser}
            correoUser={correoUser}
            setPedidoUser={setPedidoUser}
          />
        )}
      </div>
      <div className="m-10">
        {viewProductosUser && <ProductosUser pedidoUser={pedidoUser} />}
      </div>
    </div>
  );
}

export default PantallaPrincipal;
