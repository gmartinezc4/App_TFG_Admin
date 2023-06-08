import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const CERRAR_SESION = gql`
  mutation Mutation {
    cerrarSesion
  }
`;

//
// * Componente que muestra la cabecera de la apliación.
//
function Cabecera() {
  // Variables de contexto usadas.
  const { token, nivel_auth, changeReload, changeViewPerfilAdmin } = useContext(Context);

  const [OpenSubMenuPerfil, setOpenSubMenuPerfil] = useState(false);

  // Mutation para cerrar sesión.
  const [cerrarSesion] = useMutation(CERRAR_SESION, {
    onCompleted: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("nivel_auth");

      changeReload();
      setOpenSubMenuPerfil(false);
      mostrarConfirmación();
    },
    onError: (error) => {
      console.log(error);
      mostrarError();
    },
  });

  //
  // * Función para mostrar la confirmación de cerrar sesión.
  //
  function mostrarConfirmación() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Ha cerrado sesión",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //
  // * Función para mostrar un error al cerrar sesión.
  //
  function mostrarError() {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Ha ocurrido un error",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  return (
    <div className="h-20 bg-orange-900">
      <div className="grid grid-cols-2">
        <div className="grid col-start-2">
          <div
            className={
              token
                ? "bg-[url('/home/guillermo/App_TFG_Admin/front/src/assets/logo.png')] bg-no-repeat bg-cover h-14 w-14 mt-3 ml-40"
                : "bg-[url('/home/guillermo/App_TFG_Admin/front/src/assets/logo.png')] bg-no-repeat bg-cover h-14 w-14 mt-3"
            }
          ></div>
        </div>

        {/* Si hay token */}
        <div className="grid col-end-7 mr-10 h-10 mt-4">
          {token && (
            <div>
              <div className="flex flex-row">
                <button className="bg-black text-white cursor-default font-bold py-2 px-4 border border-black rounded mr-10">
                  Autorización: &nbsp; {nivel_auth}
                </button>

                {/* Boton para abrir el sub menú */}
                <button
                  className="bg-[url('/home/guillermo/App_TFG_Admin/front/src/assets/fotoPerfil.png')] bg-no-repeat bg-cover h-12 w-12"
                  id="menu-button-perfil"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setOpenSubMenuPerfil(!OpenSubMenuPerfil)}
                ></button>
              </div>

              {/* Si está abierto el sub menú */}
              {OpenSubMenuPerfil && (
                <div
                  className="absolute right-0 z-10 mt-2 mr-5 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                >
                  {/* Ir al perfil */}
                  <div className="py-1" role="none">
                    <a
                      href="#"
                      className="text-gray-700 block px-4 py-2 text-sm hover:text-orange-600"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-0"
                      onClick={() => {
                        setOpenSubMenuPerfil(false);
                        changeViewPerfilAdmin(true);
                      }}
                    >
                      Perfil
                    </a>
                  </div>

                  {/* Cerrar sesión */}
                  <div className="py-1" role="none">
                    <a
                      href="#"
                      className="text-gray-700 block px-4 py-2 text-sm hover:text-orange-600"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-1"
                      onClick={() => {
                        cerrarSesion({
                          context: {
                            headers: {
                              authorization: localStorage.getItem("token"),
                            },
                          },
                        });
                      }}
                    >
                      Cerrar Sesión
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cabecera;
