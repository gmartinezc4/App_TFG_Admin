import React, { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";

const GET_PEDIDOS_RECOGIDOS_USER = gql`
  query Query($idUser: ID!) {
    getPedidosRecogidosUser(id_user: $idUser) {
      _id
      apellido
      ciudad
      codigoPostal
      direccion
      email
      estado
      fechaPedido
      fechaRecogida
      id_user
      importeFreeIvaPedido
      importePedido
      masInformacion
      nombre
      pais
      telefono
      productos {
        _id
        cantidad
        id_producto
        id_user
        img
        name
        precioTotal
        precioTotal_freeIVA
      }
    }
  }
`;

const GET_PEDIDOS_ACTIVOS_USER = gql`
  query Query($idUser: ID!) {
    getPedidosActivosUser(id_user: $idUser) {
      _id
      apellido
      ciudad
      codigoPostal
      direccion
      email
      estado
      fechaPedido
      fechaRecogida
      id_user
      importeFreeIvaPedido
      importePedido
      masInformacion
      nombre
      pais
      telefono
      productos {
        _id
        cantidad
        id_producto
        id_user
        img
        name
        precioTotal
        precioTotal_freeIVA
      }
    }
  }
`;

const GET_PEDIDOS_PENDIENTES_USER = gql`
  query Query($idUser: ID!) {
    getPedidosPendientesUser(id_user: $idUser) {
      _id
      apellido
      ciudad
      codigoPostal
      direccion
      email
      estado
      fechaPedido
      fechaRecogida
      id_user
      importeFreeIvaPedido
      importePedido
      masInformacion
      nombre
      pais
      telefono
      productos {
        _id
        cantidad
        id_producto
        id_user
        img
        name
        precioTotal
        precioTotal_freeIVA
      }
    }
  }
`;

const GET_PEDIDOS_FILTRADOS_USER = gql`
  query GetPedidosFiltradosUser($filtro: String!, $bbdd: String!, $idUser: String!) {
    getPedidosFiltradosUser(filtro: $filtro, bbdd: $bbdd, id_user: $idUser) {
      _id
      apellido
      ciudad
      codigoPostal
      direccion
      email
      estado
      fechaPedido
      fechaRecogida
      id_user
      importeFreeIvaPedido
      importePedido
      masInformacion
      nombre
      pais
      telefono
      productos {
        _id
        cantidad
        id_producto
        img
        id_user
        name
        precioTotal
        precioTotal_freeIVA
      }
    }
  }
`;

const GET_PEDIDOS_CANCELADOS_USER = gql`
  query Query($idUser: ID!) {
    getPedidosCanceladosUser(id_user: $idUser) {
      _id
      apellido
      ciudad
      codigoPostal
      direccion
      email
      estado
      fechaPedido
      fechaRecogida
      id_user
      importeFreeIvaPedido
      importePedido
      masInformacion
      nombre
      pais
      telefono
      productos {
        _id
        cantidad
        id_producto
        id_user
        img
        name
        precioTotal
        precioTotal_freeIVA
      }
    }
  }
`;

const CAMBIAR_ESTADO_PEDIDO = gql`
  mutation CambiarEstadoPedido(
    $idPedido: ID!
    $oldEstado: String!
    $newEstado: String!
    $newFechaRecogida: String!
  ) {
    cambiarEstadoPedido(
      id_pedido: $idPedido
      oldEstado: $oldEstado
      newEstado: $newEstado
      newFechaRecogida: $newFechaRecogida
    ) {
      _id
      apellido
      ciudad
      codigoPostal
      direccion
      email
      estado
      fechaPedido
      fechaRecogida
      id_user
      importeFreeIvaPedido
      importePedido
      masInformacion
      nombre
      pais
      telefono
      productos {
        _id
        cantidad
        id_producto
        id_user
        img
        name
        precioTotal
        precioTotal_freeIVA
      }
    }
  }
`;

function PedidosUser(props) {
  let pedidoId = "";

  const [buscarPedidosActivos, setBuscarPedidosActivos] = useState("");
  const [buscarPedidosActivosAux, setBuscarPedidosActivosAux] = useState("");
  const [buscarPedidosPendientes, setBuscarPedidosPendientes] = useState("");
  const [buscarPedidosPendientesAux, setBuscarPedidosPendientesAux] = useState("");
  const [buscarPedidosCancelados, setBuscarPedidosCancelados] = useState("");
  const [buscarPedidosCanceladosAux, setBuscarPedidosCanceladosAux] = useState("");
  const [buscarPedidosRecogidos, setBuscarPedidosRecogidos] = useState("");
  const [buscarPedidosRecogidosAux, setBuscarPedidosRecogidosAux] = useState("");
  const [bbddFiltro, setBbddFiltro] = useState("");

  useEffect(() => {
    changeVolverDeProductos("PedidosUser");
  }, []);

  const {
    changeViewProductosUser,
    changeViewUsuarios,
    changeReload,
    changeVolverDeProductos,
    changeEnviarCorreoConfirmacion,
  } = useContext(Context);

  const [cambiarEstadoPedido] = useMutation(CAMBIAR_ESTADO_PEDIDO, {
    onCompleted: (data) => {
      console.log("Se ha cambiado el estado del pedido");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Estado del pedido cambiado",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        props.setPedidoUser(data.cambiarEstadoPedido);
        //changeEnviarCorreoConfirmacion(true);
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
    data: dataRecogidos,
    loading: loadingRecogidos,
    error: errorRecogidos,
  } = useQuery(GET_PEDIDOS_RECOGIDOS_USER, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      idUser: props.idUser,
    },
  });

  const {
    data: dataActivos,
    loading: loadingActivos,
    error: errorActivos,
  } = useQuery(GET_PEDIDOS_ACTIVOS_USER, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      idUser: props.idUser,
    },
  });

  const {
    data: dataPendientes,
    loading: loadingPendientes,
    error: errorPendientes,
  } = useQuery(GET_PEDIDOS_PENDIENTES_USER, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      idUser: props.idUser,
    },
  });

  const {
    data: dataCancelados,
    loading: loadingCancelados,
    error: errorCancelados,
  } = useQuery(GET_PEDIDOS_CANCELADOS_USER, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      idUser: props.idUser,
    },
  });

  const {
    data: dataFiltrados,
    loading: loadingFiltrados,
    error: errorFiltrados,
  } = useQuery(GET_PEDIDOS_FILTRADOS_USER, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      filtro: buscarPedidosActivos,
      bbdd: bbddFiltro,
      idUser: props.idUser,
    },
  });

  if (loadingRecogidos) return <div></div>;
  if (errorRecogidos) return console.log(errorRecogidos);

  if (loadingActivos) return <div></div>;
  if (errorActivos) return console.log(errorActivos);

  if (loadingPendientes) return <div></div>;
  if (errorPendientes) return console.log(errorPendientes);

  if (loadingCancelados) return <div></div>;
  if (errorCancelados) return console.log(errorCancelados);

  if (loadingFiltrados) return <div></div>;
  if (errorFiltrados) console.log(errorFiltrados);

  function modalCancelarPedido(estadoActual) {
    Swal.fire({
      icon: "warning",
      title: "¿Confirmar cambios?",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#DF0000",
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstadoPedido({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idPedido: pedidoId,
            oldEstado: estadoActual,
            newEstado: "Cancelado",
          },
        });
      }
      pedidoId = "";
    });
  }

  async function modalCambiarEstadoPedido(estadoActual, fechaReferencia) {
    const { value: newEstado } = await Swal.fire({
      title: "Nuevo estado del pedido",
      input: "select",
      inputOptions: {
        Activo: "Activo",
        Pendiente: "Pendiente",
        Recogido: "Recogido",
      },
      inputPlaceholder: "Nuevo estado del pedido",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3BD630",
      cancelButtonColor: "#DF0000",
    });

    if (newEstado == estadoActual) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Elige un estado distinto al actual",
        text: `Estado actual: ${estadoActual}`,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        modalCambiarEstadoPedido(estadoActual);
      });
    } else if (newEstado) {
      if (newEstado == "Cancelado") {
        cambiarEstadoPedido({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idPedido: pedidoId,
            oldEstado: estadoActual,
            newEstado: newEstado,
            newFechaRecogida: "",
          },
        });
      } else if (newEstado == "Recogido") {
        cambiarEstadoPedido({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idPedido: pedidoId,
            oldEstado: estadoActual,
            newEstado: newEstado,
            newFechaRecogida: "",
          },
        });
      } else if (estadoActual == "Activo")
        modalCambiarFechaPedidoActivo(estadoActual, newEstado, fechaReferencia);
      else if (estadoActual == "Pendiente")
        modalCambiarFechaPedidoPendiente(estadoActual, newEstado, fechaReferencia);
      else if (estadoActual == "Cancelado" || estadoActual == "Recogido")
        modalCambiarFechaPedidoCanceladoRecogido(estadoActual, newEstado);
    }
  }

  async function modalCambiarFechaPedidoActivo(estadoActual, newEstado, fechaReferencia) {
    let fecha = new Date();
    let fechaMañana =
      fecha.getDate() + 1 + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();

    const { value: newFechaRecogida } = await Swal.fire({
      title: "Nueva fecha de recogida",
      text: `Estimación dada: ${fechaReferencia}`,
      input: "text",
      inputValue: fechaMañana,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3BD630",
      cancelButtonColor: "#DF0000",
    });

    if (newFechaRecogida != undefined) {
      if (new Date(newFechaRecogida) <= new Date()) {
        console.log("fecha incorrecta");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Fecha Invalida",
          text: "La fecha de entrega ha de ser superior a hoy",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          modalCambiarFechaPedidoActivo(estadoActual, newEstado, fechaReferencia);
        });
      } else {
        console.log(newFechaRecogida);

        cambiarEstadoPedido({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idPedido: pedidoId,
            oldEstado: estadoActual,
            newEstado: newEstado,
            newFechaRecogida: newFechaRecogida,
          },
        }).then(() => {
          pedidoId = "";
        });
      }
    }
  }

  async function modalCambiarFechaPedidoPendiente(
    estadoActual,
    newEstado,
    fechaReferencia
  ) {
    let fecha = new Date();
    let fechaMañana =
      fecha.getDate() + 1 + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();

    const { value: newFechaRecogida } = await Swal.fire({
      title: "Nueva estimación de recogida",
      text: `Antigua fecha de entrega: ${fechaReferencia}`,
      input: "text",
      inputValue: fechaMañana,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3BD630",
      cancelButtonColor: "#DF0000",
    });

    if (newFechaRecogida != undefined) {
      console.log("n f " + newFechaRecogida);
      console.log("f ref " + fechaReferencia);
      if (new Date(newFechaRecogida) <= new Date(fechaReferencia)) {
        console.log("fecha incorrecta");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Fecha Invalida",
          text: "La nueva estimación de entrega ha de ser mayor",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          modalCambiarFechaPedidoPendiente(estadoActual, newEstado, fechaReferencia);
        });
      } else {
        console.log(newFechaRecogida);

        cambiarEstadoPedido({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idPedido: pedidoId,
            oldEstado: estadoActual,
            newEstado: newEstado,
            newFechaRecogida: newFechaRecogida,
          },
        }).then(() => {
          pedidoId = "";
        });
      }
    }
  }

  async function modalCambiarFechaPedidoCanceladoRecogido(estadoActual, newEstado) {
    let fecha = new Date();
    let fechaHoy =
      fecha.getDate() + 1 + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
    let fechaMañana =
      fecha.getDate() + 1 + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();

    const { value: newFechaRecogida } = await Swal.fire({
      title: "Nueva fecha o estimación de recogida",
      text: `Estimación dada: ${fechaHoy}`,
      input: "text",
      inputValue: fechaMañana,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3BD630",
      cancelButtonColor: "#DF0000",
    });

    if (newFechaRecogida != undefined) {
      if (new Date(newFechaRecogida) <= new Date()) {
        console.log("fecha incorrecta");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Fecha Invalida",
          text: "La fecha de entrega ha de ser superior a hoy",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          modalCambiarFechaPedidoCanceladoRecogido(estadoActual, newEstado);
        });
      } else {
        console.log(newFechaRecogida);

        cambiarEstadoPedido({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idPedido: pedidoId,
            oldEstado: estadoActual,
            newEstado: newEstado,
            newFechaRecogida: newFechaRecogida,
          },
        }).then(() => {
          pedidoId = "";
        });
      }
    }
  }

  return (
    <div>
      <button
        className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 border border-black hover:border-white rounded"
        onClick={() => {
          changeViewUsuarios(true);
        }}
      >
        volver
      </button>
      <div>
        <h1 className="flex justify-center text-2xl underline font-bold mb-5">USUARIO</h1>
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
                        Nombre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Apellido
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {props.idUser}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {props.nombreUser}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {props.apellidoUser}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {props.correoUser}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dataActivos.getPedidosActivosUser.length != 0 && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
            PEDIDOS ACTIVOS
          </h1>

          <div className="flex flex-row py-3 pl-2">
            <div className="relative max-w-xs">
              <input
                type="text"
                className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                placeholder="Buscar por fecha de recogida..."
                value={buscarPedidosActivosAux}
                onChange={(e) => {
                  setBuscarPedidosActivosAux(e.target.value);
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
                onClick={() => {
                  setBbddFiltro("Pedidos_Activos");
                  setBuscarPedidosActivos(buscarPedidosActivosAux);
                }}
              >
                Buscar
              </button>
            </div>
          </div>

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
                          ID pedido
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Fecha del pedido
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Fecha de recogida
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Importe
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Importe &#40;Free Iva&#41;
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                          Productos
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                          Cancelar pedido
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {!buscarPedidosActivos &&
                        dataActivos.getPedidosActivosUser.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 hover:underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(pedidos.estado);
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer"
                                onClick={() => {
                                  props.setPedidoUser(pedidos);
                                  changeViewProductosUser(true);
                                }}
                              >
                                Productos
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                onClick={() => {
                                  pedidoId = pedidos._id;
                                  modalCancelarPedido(pedidos.estado);
                                }}
                              >
                                Cancelar pedido
                              </a>
                            </td>
                          </tr>
                        ))}

                      {buscarPedidosActivos &&
                        dataFiltrados.getPedidosFiltradosUser.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 hover:underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(pedidos.estado);
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer"
                                onClick={() => {
                                  props.setPedidoUser(pedidos);
                                  changeViewProductosUser(true);
                                }}
                              >
                                Productos
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                onClick={() => {
                                  pedidoId = pedidos._id;
                                  modalCancelarPedido(pedidos.estado);
                                }}
                              >
                                Cancelar pedido
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

      {dataPendientes.getPedidosPendientesUser.length != 0 && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
            PEDIDOS PENDIENTES DE RECOGER
          </h1>

          <div className="flex flex-row py-3 pl-2">
            <div className="relative max-w-xs">
              <input
                type="text"
                className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                placeholder="Buscar por fecha de recogida..."
                value={buscarPedidosPendientesAux}
                onChange={(e) => {
                  setBuscarPedidosPendientesAux(e.target.value);
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
                onClick={() => {
                  setBbddFiltro("Pedidos_Pendientes");
                  setBuscarPedidosPendientes(buscarPedidosPendientesAux);
                }}
              >
                Buscar
              </button>
            </div>
          </div>
          
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
                          ID pedido
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Fecha del pedido
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Fecha de recogida
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Importe
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Importe &#40;Free Iva&#41;
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                          Productos
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                          Cancelar pedido
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {!buscarPedidosPendientes &&
                        dataPendientes.getPedidosPendientesUser.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 hover:underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(pedidos.estado);
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer"
                                onClick={() => {
                                  props.setPedidoUser(pedidos);
                                  changeViewProductosUser(true);
                                }}
                              >
                                Productos
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                onClick={() => {
                                  pedidoId = pedidos._id;
                                  modalCancelarPedido(pedidos.estado);
                                }}
                              >
                                Cancelar pedido
                              </a>
                            </td>
                          </tr>
                        ))}

                      {buscarPedidosPendientes &&
                        dataFiltrados.getPedidosFiltradosUser.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 hover:underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(pedidos.estado);
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer"
                                onClick={() => {
                                  props.setPedidoUser(pedidos);
                                  changeViewProductosUser(true);
                                }}
                              >
                                Productos
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                onClick={() => {
                                  pedidoId = pedidos._id;
                                  modalCancelarPedido(pedidos.estado);
                                }}
                              >
                                Cancelar pedido
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

      {dataCancelados.getPedidosCanceladosUser.length != 0 && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
            PEDIDOS CANCELADOS
          </h1>

          <div className="flex flex-row py-3 pl-2">
            <div className="relative max-w-xs">
              <input
                type="text"
                className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                placeholder="Buscar por fecha de cancelación..."
                value={buscarPedidosCanceladosAux}
                onChange={(e) => {
                  setBuscarPedidosCanceladosAux(e.target.value);
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
                onClick={() => {
                  setBbddFiltro("Pedidos_Cancelados");
                  setBuscarPedidosCancelados(buscarPedidosCanceladosAux);
                }}
              >
                Buscar
              </button>
            </div>
          </div>
          
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
                          ID pedido
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Fecha del pedido
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Fecha de recogida
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Importe
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Importe &#40;Free Iva&#41;
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                          Productos
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {!buscarPedidosCancelados &&
                        dataCancelados.getPedidosCanceladosUser.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 hover:underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(pedidos.estado);
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer"
                                onClick={() => {
                                  props.setPedidoUser(pedidos);
                                  changeViewProductosUser(true);
                                }}
                              >
                                Productos
                              </a>
                            </td>
                          </tr>
                        ))}

                      {buscarPedidosCancelados &&
                        dataFiltrados.getPedidosFiltradosUser.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 hover:underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(pedidos.estado);
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer"
                                onClick={() => {
                                  props.setPedidoUser(pedidos);
                                  changeViewProductosUser(true);
                                }}
                              >
                                Productos
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

      {dataRecogidos.getPedidosRecogidosUser.length != 0 && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
            PEDIDOS RECOGIDOS
          </h1>

          <div className="flex flex-row py-3 pl-2">
            <div className="relative max-w-xs">
              <input
                type="text"
                className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                placeholder="Buscar por fecha de recogida..."
                value={buscarPedidosRecogidosAux}
                onChange={(e) => {
                  setBuscarPedidosRecogidosAux(e.target.value);
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
                onClick={() => {
                  setBbddFiltro("Pedidos_Recogidos");
                  setBuscarPedidosRecogidos(buscarPedidosRecogidosAux);
                }}
              >
                Buscar
              </button>
            </div>
          </div>

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
                          ID pedido
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Fecha del pedido
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Fecha de recogida
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Importe
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Importe &#40;Free Iva&#41;
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                        >
                          Productos
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {!buscarPedidosRecogidos &&
                        dataRecogidos.getPedidosRecogidosUser.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 hover:underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(pedidos.estado);
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer"
                                onClick={() => {
                                  props.setPedidoUser(pedidos);
                                  changeViewProductosUser(true);
                                }}
                              >
                                Productos
                              </a>
                            </td>
                          </tr>
                        ))}

                      {buscarPedidosRecogidos &&
                        dataFiltrados.getPedidosFiltradosUser.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 hover:underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(pedidos.estado);
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer"
                                onClick={() => {
                                  props.setPedidoUser(pedidos);
                                  changeViewProductosUser(true);
                                }}
                              >
                                Productos
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

export default PedidosUser;
