import React, { useContext } from "react";
import { Context } from "../context/Context";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const CERRAR_SESION = gql`
  mutation Mutation {
    cerrarSesion
  }
`;

function Cabecera() {
  const { token, nivel_auth, changeReload } = useContext(Context);

  const [cerrarSesion] = useMutation(CERRAR_SESION, {
    onCompleted: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("nivel_auth");

      changeReload();
      mostrarConfirmación();
    },
    onError: (error) => {
      console.log(error);
      mostrarError();
    },
  });

  function mostrarConfirmación() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Ha cerrado sesión",
      showConfirmButton: false,
      timer: 1500,
    });
  }

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

        <div className="grid col-end-7 mr-10 h-10 mt-4">
          {token && (
            <div className="flex flex-row">
              <button className="bg-black text-white cursor-default font-bold py-2 px-4 border border-black rounded mr-10">
                Autorización: &nbsp; {nivel_auth}
              </button>

              <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 border border-black hover:border-white rounded"
              onClick={() => {
                cerrarSesion({
                  context: {
                    headers: {
                      authorization: token,
                    },
                  },
                });
              }}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cabecera;
