import React, { useContext, useState } from "react";
import RegistrarAdmin from "./RegistrarAdmin";
import { Context } from "../context/Context";
import MostrarUsuarios from "./MostrarUsuarios";
import PedidosUser from "./PedidosUser";
import ProductosUser from "./ProductosUser";
import AllPedidos from "./AllPedidos";
import ProductosWeb from "./ProductosWeb";
import MaderasWeb from "./MaderasWeb";
import CorreoConfirmacion from "./CorreoConfirmacion";
import PerfilAdmin from "./PerfilAdmin";


// 
// * Componente PantallaPrincipal.
// * Se encarga de mostrar el componente elegido en el menú lateral,
//
function PantallaPrincipal() {
  // Variables del contexto usadas
  const {
    viewRegistro,
    viewUsuarios,
    viewPedidosUser,
    viewProductosUser,
    viewTodosPedidos,
    viewProductosWeb,
    viewMaderasWeb,
    viewPerfilAdmin,
    enviarCorreoConfirmacion,
  } = useContext(Context);

  const [idUser, setIdUser] = useState("");
  const [nombreUser, setNombreUser] = useState("");
  const [apellidoUser, setApellidoUser] = useState("");
  const [correoUser, setCorreoUser] = useState("");

  const [pedidoUser, setPedidoUser] = useState();

  //
  // * Funcińo para darle valor las variables de estado desde otros componentes.
  //
  // * idUser: ID del usuario.
  // * nombreUser: nombre del usuario.
  // * apellidoUser: apellido del usuario.
  // * correoUser: correo del usuario.
  //
  function setDatosUser(idUser, nombreUser, apellidoUser, correoUser) {
    setIdUser(idUser);
    setNombreUser(nombreUser);
    setApellidoUser(apellidoUser);
    setCorreoUser(correoUser);
  }

  return (
    <div>
      <div className="m-10">{viewPerfilAdmin && <PerfilAdmin />} </div>
      <div className="flex justify-center">{viewRegistro && <RegistrarAdmin />}</div>
      <div className="m-10 ">
        {viewUsuarios && <MostrarUsuarios setDatosUser={setDatosUser} />}
      </div>
      <div className="m-10 ">
        {viewPedidosUser && (
          <div>
            <PedidosUser
              idUser={idUser}
              nombreUser={nombreUser}
              apellidoUser={apellidoUser}
              correoUser={correoUser}
              pedido={pedidoUser}
              setPedidoUser={setPedidoUser}
            />
          </div>
        )}
      </div>
      <div className="m-10">
        {viewProductosUser && <ProductosUser pedidoUser={pedidoUser} />}
      </div>
      <div className="m-10">
        {viewTodosPedidos && (
          <div>
            <AllPedidos setPedidoUser={setPedidoUser} />
          </div>
        )}
      </div>
      <div className="m-10">
        {viewProductosWeb && (
          <div>
            <ProductosWeb />
          </div>
        )}
      </div>
      <div className="m-10">
        {viewMaderasWeb && (
          <div>
            <MaderasWeb />
          </div>
        )}
      </div>

      {enviarCorreoConfirmacion && <CorreoConfirmacion pedido={pedidoUser} />}
    </div>
  );
}

export default PantallaPrincipal;
