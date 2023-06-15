import React, { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";
import Cargando from "./Cargando";

const GET_ALL_MADERAS = gql`
  query Query {
    getMaderas {
      _id
      description
      img
      name
    }
  }
`;

const BORRAR_MADERA = gql`
  mutation BorrarMadera($idMadera: ID!) {
    borrarMadera(id_madera: $idMadera) {
      _id
      description
      img
      name
    }
  }
`;

const MODIFICAR_MADERA = gql`
  mutation ModificarMadera(
    $idMadera: ID!
    $img: String
    $name: String
    $description: String
  ) {
    modificarMadera(
      id_madera: $idMadera
      img: $img
      name: $name
      description: $description
    ) {
      _id
      description
      img
      name
    }
  }
`;

const ADD_MADERA = gql`
  mutation DarAltaMadera($img: String!, $name: String!, $description: String!) {
    darAltaMadera(img: $img, name: $name, description: $description) {
      description
      img
      name
    }
  }
`;

const GET_MADERAS_FILTRADAS = gql`
  query GetMaderasFiltradas($filtro: String!) {
    getMaderasFiltradas(filtro: $filtro) {
      _id
      description
      img
      name
    }
  }
`;

//
// * Componente MaderasWeb.
// * Muestra las tablas de las maderas.
//
function MaderasWeb() {
  // Variables usadas del contexto.
  const { changeReload, changeErrorTrue, changeCodigoError, changeMensajeError } =
    useContext(Context);

  const [buscarMadera, setBuscarMadera] = useState("");
  const [buscarMaderaAux, setBuscarMaderaAux] = useState("");

  // Mutation para borrar una madera.
  const [borrarMadera] = useMutation(BORRAR_MADERA, {
    onCompleted: () => {
      console.log("Se ha eliminado la madera");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha eliminado la madera",
        showConfirmButton: false,
        timer: 1000,
      });
    },
    onError: (error) => {
      // Si hay un error, borrar el token.
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ha ocurrido un error",
        text: "Por favor, intentelo de nuevo",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  // Mutation para modificar una madera.
  const [modificarMadera] = useMutation(MODIFICAR_MADERA, {
    onCompleted: () => {
      console.log("Se ha modificado la madera");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha modificado la madera",
        showConfirmButton: false,
        timer: 1000,
      });
    },
    onError: (error) => {
      // Si hay un error, borrar el token.
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ha ocurrido un error",
        text: "Por favor, intentelo de nuevo",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  // Mutation para añadir una madera.
  const [addMadera] = useMutation(ADD_MADERA, {
    onCompleted: () => {
      console.log("Se ha añadido la madera");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha añadido la madera",
        showConfirmButton: false,
        timer: 1000,
      });
    },
    onError: (error) => {
      // Si hay un error, borrar el token.
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ha ocurrido un error",
        text: "Por favor, intentelo de nuevo",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  // Query para traera todas las maderas.
  const {
    data: dataGetAllMaderas,
    loading: loadingGetAllMaderas,
    error: errorGetAllMaderas,
  } = useQuery(GET_ALL_MADERAS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  // Query para traer todas las maderas con un filtro aplicado.
  const {
    data: dataGetMaderasFiltradas,
    loading: loadingGetMaderasFiltradas,
    error: errorGetMaderasFiltradas,
  } = useQuery(GET_MADERAS_FILTRADAS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      filtro: buscarMadera,
    },
  });

  if (loadingGetAllMaderas || loadingGetMaderasFiltradas)
    return (
      <div>
        <Cargando />
      </div>
    );
  if (errorGetAllMaderas)
    return (
      <div>
        {changeErrorTrue()} {changeCodigoError(404)}
        {changeMensajeError(errorGetAllMaderas.message)}
      </div>
    );

  if (errorGetMaderasFiltradas)
    return (
      <div>
        {changeErrorTrue()} {changeCodigoError(404)}
        {changeMensajeError(errorGetMaderasFiltradas.message)}
      </div>
    );

  //
  // * Función que muestra la confirmación de la eliminación de la madera.
  // * Realiza la mutation borrarMadera.
  //
  // * idMadera: ID de la madera eliminada.
  //
  function modalBorrarMadera(idMadera) {
    Swal.fire({
      icon: "warning",
      title: "¿Confirmar cambios?",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#DF0000",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        borrarMadera({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idMadera: idMadera,
          },
        });
      }
    });
  }

  //
  // * Función para editar una madera.
  // * Realiza la mutation modificarMadera.
  //
  // * idMadera: ID de la madera eliminada.
  // * img: url actual.
  // * name: nombre actual.
  // * description: descripción actual.
  //
  async function modalModificarMadera(idMadera, img, name, description) {
    console.log(description);
    const { value: formValues } = await Swal.fire({
      title: "Editar Madera",
      html:
        "<label><strong>Imagen</strong></label>" +
        `<input id="img" value="${img}" class="swal2-input">` +
        "<br></br>" +
        "<label><strong>Nombre</strong></label>" +
        `<input id="name" value="${name}" class="swal2-input">` +
        "<br></br>" +
        "<label><strong>Descripción</strong></label>" +
        "<br></br>" +
        `<textarea type="text" id="description" class="swal2-input">${description}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Editar",
      confirmButtonColor: "#3BD630",
      cancelButtonColor: "#DF0000",
      cancelButtonText: "Cancelar",
    });
    if (formValues) {
      if (
        document.getElementById("img").value != "" ||
        document.getElementById("name").value != "" ||
        document.getElementById("description").value != ""
      ) {
        modificarMadera({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idMadera: idMadera,
            img: document.getElementById("img").value || "",
            name: document.getElementById("name").value || "",
            description: document.getElementById("description").value || "",
          },
        });
      }
    }
  }

  //
  // * Función para añadir una madera.
  // * Realiza la mutation addMadera.
  //
  async function modalAddMadera() {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Producto",
      html:
        "<label><strong>Imagen</strong></label>" +
        '<input id="img" class="swal2-input" placeholder="Url...">' +
        "<br></br>" +
        "<label><strong>Nombre</strong></label>" +
        '<input id="name" class="swal2-input" placeholder="Nombre...">' +
        "<br></br>" +
        "<label><strong>Descripción</strong></label>" +
        "<br></br>" +
        '<textarea type="text" id="description" class="swal2-input" placeholder="Descripción de la madera..."></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Añadir",
      confirmButtonColor: "#3BD630",
      cancelButtonColor: "#DF0000",
      cancelButtonText: "Cancelar",
    });
    if (formValues) {
      if (
        document.getElementById("img").value != "" &&
        document.getElementById("name").value != "" &&
        document.getElementById("description").value != ""
      ) {
        addMadera({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            img: document.getElementById("img").value,
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
          },
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Rellene todos los campos",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          modalAddMadera();
        });
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-mono text-orange-900 mb-10">
          Base de datos Tipos_Madera
        </h1>

        {/* Boton para llama a la función modalAddMadera */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 border border-black hover:border-white rounded"
          onClick={() => {
            modalAddMadera();
          }}
        >
          Añadir madera
        </button>
      </div>

      <div>
        <h1 className="flex justify-center text-2xl underline font-bold mb-5">MADERAS</h1>

        {/* Buscar en la tabla */}
        <div className="flex flex-row py-3 pl-2">
          <div className="relative max-w-xs">
            <input
              type="text"
              className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
              placeholder="Buscar por nombre..."
              value={buscarMaderaAux}
              onChange={(e) => {
                setBuscarMaderaAux(e.target.value);
              }}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="h-3.5 w-3.5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </div>
          </div>
          <div>
            <button
              className="rounded border-2 border-black ml-3 bg-white p-2 hover:bg-transparent"
              onClick={() => setBuscarMadera(buscarMaderaAux)}
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Tabla de las maderas */}

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 border-2">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        ID producto
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Imagen
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Nombre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Descripción
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                      >
                        Editar
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                      >
                        Eliminar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Si no hay un filtro para buscar */}
                    {!buscarMadera &&
                      dataGetAllMaderas.getMaderas.map((madera) => (
                        <tr key={madera._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {madera._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-pre-wrap">
                            {madera.img}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {madera.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-pre-wrap">
                            {madera.description}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-green-500 hover:text-green-700 cursor-pointer"
                              onClick={() => {
                                modalModificarMadera(
                                  madera._id,
                                  madera.img,
                                  madera.name,
                                  madera.description
                                );
                              }}
                            >
                              Editar
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                modalBorrarMadera(madera._id);
                              }}
                            >
                              Eliminar
                            </a>
                          </td>
                        </tr>
                      ))}

                    {/* Si hay un filtro para buscar */}
                    {buscarMadera &&
                      dataGetMaderasFiltradas.getMaderasFiltradas.map((madera) => (
                        <tr key={madera._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {madera._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-pre">
                            {madera.img}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {madera.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-pre-wrap">
                            {madera.description}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-green-500 hover:text-green-700 cursor-pointer"
                              onClick={() => {
                                modalModificarMadera(
                                  madera._id,
                                  madera.img,
                                  madera.name,
                                  madera.description
                                );
                              }}
                            >
                              Editar
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                modalBorrarMadera(madera._id);
                              }}
                            >
                              Eliminar
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaderasWeb;
