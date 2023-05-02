import React, { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";

const GET_ADMINS = gql`
  query Query {
    getAdmins {
      _id
      apellido
      email
      nivel_auth
      nombre
      password
      token
    }
  }
`;

const GET_USERS = gql`
  query Query {
    getUsuarios {
      _id
      apellido
      email
      nombre
      password
      token
    }
  }
`;

const CHANGE_LVL_AUTH = gql`
  mutation Mutation($idUser: ID!, $newNivelAuth: String!) {
    ChangeLvlAuth(idUser: $idUser, newNivel_auth: $newNivelAuth) {
      _id
      apellido
      email
      nivel_auth
      nombre
      password
      token
    }
  }
`;

const BORRAR_USER_ADMIN = gql`
  mutation BorraUserAdmin($idUser: ID!) {
    borraUserAdmin(idUser: $idUser) {
      _id
      apellido
      email
      nivel_auth
      nombre
      password
      token
    }
  }
`;

const BORRAR_USER = gql`
  mutation BorraUser($idUser: ID!) {
    borraUser(idUser: $idUser) {
      _id
      apellido
      email
      nombre
      password
      token
    }
  }
`;

function MostrarUsuarios(props) {
  const { changeReload, reload, viewPedidosUser, changeViewPedidosUser } = useContext(Context);

  useEffect(() => {
  }, [reload])

  const [changeLvlAuthUserAdmin] = useMutation(CHANGE_LVL_AUTH, {
    onCompleted: () => {
      console.log("Se ha cambiado el nivel de autorización del usuario admin");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Operación realizada con éxito",
        text: `Nuevo nivel de autorización: ${nivelAuth}`,
        showConfirmButton: false,
        timer: 1500,
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

  const [borrarUserAdmin] = useMutation(BORRAR_USER_ADMIN, {
    onCompleted: () => {
      console.log("Se ha borrado el usuario admin");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario eliminado",
        showConfirmButton: false,
        timer: 1500,
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

  const [borrarUser] = useMutation(BORRAR_USER, {
    onCompleted: () => {
      console.log("Se ha borrado el usuario");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario eliminado",
        showConfirmButton: false,
        timer: 1500,
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

  const {
    data: dataGetAdmins,
    loading: loadingGetAdmins,
    error: errorGetAdmins,
  } = useQuery(GET_ADMINS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  const {
    data: dataGetUsuarios,
    loading: loadingGetUsuarios,
    error: errorGetUsuarios,
  } = useQuery(GET_USERS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  if (loadingGetAdmins) return <div></div>;
  if (errorGetAdmins) return <div>{console.log(error)}</div>;

  if (loadingGetUsuarios) return <div></div>;
  if (errorGetUsuarios) return <div>{console.log(error)}</div>;

  async function modalCambiarNivelAuthAdmin(AdminId) {
    const { value: nivelAuth } = await Swal.fire({
      title: "Editar Administrador",
      input: "number",
      inputLabel: "Introduce el nuevo nivel de autorización del administrador",
      inputPlaceholder: "Disponibles: 1, 2",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3BD630",
      cancelButtonColor: "#DF0000",
    });

    if (nivelAuth) {
      if(nivelAuth > 2){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Nivel de autorización no valido",
          text: "valores válidos: 1 y 2",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          modalCambiarNivelAuthAdmin(AdminId)
        });
      }else{
        changeLvlAuthUserAdmin({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idUser: AdminId,
            newNivelAuth: nivelAuth,
          },
        })
      }
    }
  }

  function modalBorrarUserAdmin(AdminId) {
    Swal.fire({
      icon: 'warning',
      title: '¿Confirmar cambios?',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      confirmButtonColor: "#DF0000",
    }).then((result) => {
      if (result.isConfirmed) {
        borrarUserAdmin({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idUser: AdminId,
          },
        });
      }
    })
  }

  function modalBorrarUser(UserId) {
    console.log(UserId)
    Swal.fire({
      icon: 'warning',
      title: '¿Confirmar cambios?',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      confirmButtonColor: "#DF0000",
    }).then((result) => {
      if (result.isConfirmed) {
        borrarUser({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idUser: UserId,
          },
        });
      }
    })
  }

  return (
    <div>
      <button
        className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 border border-black hover:border-white rounded"
        onClick={() => {}}
      >
        volver
      </button>
      {!viewPedidosUser && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5">
            ADMINISTRADORES
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
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          N. Autorización
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
                          Borrar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dataGetAdmins.getAdmins.map((userAdmin) => (
                        <tr key={userAdmin._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {userAdmin._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {userAdmin.nombre + " " + userAdmin.apellido}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {userAdmin.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {userAdmin.nivel_auth}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-green-500 hover:text-green-700 cursor-pointer"
                              onClick={() => {
                                modalCambiarNivelAuthAdmin(userAdmin._id);
                              }}
                            >
                              Editar
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                modalBorrarUserAdmin(userAdmin._id);
                              }}
                            >
                              Borrar
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

          <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
            USUARIOS
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
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                          Pedidos
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                          Borrar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dataGetUsuarios.getUsuarios.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {user._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {user.nombre + " " + user.apellido}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                              onClick={() => {
                                changeViewPedidosUser(true);
                                props.setDatosUser(
                                  user._id,
                                  user.nombre,
                                  user.apellido,
                                  user.email
                                );
                              }}
                            >
                              Pedidios
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap ">
                            <a
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                modalBorrarUser(user._id);
                              }}
                            >
                              Borrar
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
      )}
    </div>
  );
}

export default MostrarUsuarios;
