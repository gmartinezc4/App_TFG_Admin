import React, { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";

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
  mutation ModificarMadera($idMadera: ID!, $img: String, $name: String, $description: String) {
  modificarMadera(id_madera: $idMadera, img: $img, name: $name, description: $description) {
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

function MaderasWeb() {
    const { changeReload } = useContext(Context);

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
        //si hay un error, borrar el token
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
        //si hay un error, borrar el token
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
        //si hay un error, borrar el token
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
  
    const { data, loading, error } = useQuery(GET_ALL_MADERAS, {
      context: {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      },
    });
  
    if (loading) return <div></div>;
    if (error) return console.log(error);
  
    function modalBorrarMadera(idMadera) {
      Swal.fire({
        icon: "warning",
        title: "¿Confirmar cambios?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF0000",
        cancelButtonText: "Cancelar"
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
  
    async function modalModificarMadera(idMadera, img, name, description) {
        console.log(description)
      const { value: formValues } = await Swal.fire({
        title: "Editar Madera",
        html:
          "<label><strong>Imagen</strong></label>" +
          `<input id="img" value="${img}" class="swal2-input">` + '<br></br>' +
          "<label><strong>Nombre</strong></label>" +
          `<input id="name" value="${name}" class="swal2-input">` + '<br></br>' +
          "<label><strong>Descripción</strong></label>" + '<br></br>' +
          `<textarea type="text" id="description" class="swal2-input">${description}</textarea>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Editar",
        confirmButtonColor: "#3BD630",
        cancelButtonColor: "#DF0000",
        cancelButtonText: "Cancelar"
      })
          if(formValues){
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
  
    async function modalAddMadera() {
      const { value: formValues } = await Swal.fire({
        title: "Añadir Producto",
        html:
          "<label><strong>Imagen</strong></label>" +
          '<input id="img" class="swal2-input" placeholder="Url...">' + '<br></br>' +
          "<label><strong>Nombre</strong></label>" +
          '<input id="name" class="swal2-input" placeholder="Nombre...">' + '<br></br>' +
          "<label><strong>Descripción</strong></label>" + '<br></br>' +
          '<textarea type="text" id="description" class="swal2-input" placeholder="Descripción de la madera..."></textarea>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Añadir",
        confirmButtonColor: "#3BD630",
        cancelButtonColor: "#DF0000",
        cancelButtonText: "Cancelar"
      })
          if(formValues){
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
              }else{
                  Swal.fire({
                      position: "center",
                      icon: "error",
                      title: "Rellene todos los campos",
                      showConfirmButton: false,
                      timer: 1500,
                    }).then(() => {
                        modalAddMadera();
                    })
              }
          }
      
    }
  
    return (
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-mono text-orange-900 mb-10">
            Base de datos Tipos_Madera
          </h1>
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
          <h1 className="flex justify-center text-2xl underline font-bold mb-5">
            MADERAS
          </h1>
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
                      {data.getMaderas.map((madera) => (
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
                                modalModificarMadera(madera._id, madera.img, madera.name, madera.description);
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

export default MaderasWeb