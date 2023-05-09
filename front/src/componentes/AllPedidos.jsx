import React, { useContext, useState, useEffect, useRef } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";
import Pikaday from "pikaday";

const GET_PEDIDOS_RECOGIDOS = gql`
  query Query {
    getPedidosRecogidos {
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

const GET_PEDIDOS_ACTIVOS = gql`
  query Query {
    getPedidosActivos {
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

const GET_PEDIDOS_PENDIENTES = gql`
  query Query {
    getPedidosPendientes {
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

const GET_PEDIDOS_CANCELADOS = gql`
  query Query {
    getPedidosCancelados {
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

const GET_PEDIDOS_ELIMINADOS = gql`
  query Query {
    getPedidosEliminados {
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

const GET_PEDIDOS_FILTRADOS = gql`
  query GetPedidosFiltrados($filtro: String!, $bbdd: String!) {
    getPedidosFiltrados(filtro: $filtro, bbdd: $bbdd) {
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

function AllPedidos(props) {
  let pedidoId = "";

const [buscarPedidosActivos, setBuscarPedidosActivos] = useState("");
const [buscarPedidosActivosAux, setBuscarPedidosActivosAux] = useState("");
const [buscarPedidosPendientes, setBuscarPedidosPendientes] = useState("");
const [buscarPedidosPendientesAux, setBuscarPedidosPendientesAux] = useState("");
const [buscarPedidosCancelados, setBuscarPedidosCancelados] = useState("");
const [buscarPedidosCanceladosAux, setBuscarPedidosCanceladosAux] = useState("");
const [buscarPedidosRecogidos, setBuscarPedidosRecogidos] = useState("");
const [buscarPedidosRecogidosAux, setBuscarPedidosRecogidosAux] = useState("");
const [buscarPedidosEliminados, setBuscarPedidosEliminados] = useState("");
const [buscarPedidosEliminadosAux, setBuscarPedidosEliminadosAux] = useState("");
const [bbddFiltro, setBbddFiltro] = useState("");


  useEffect(() => {
    changeVolverDeProductos("AllPedidos");
  }, []);

  const {
    changeViewProductosUser,
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
        changeEnviarCorreoConfirmacion(true);
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
  } = useQuery(GET_PEDIDOS_RECOGIDOS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  const {
    data: dataActivos,
    loading: loadingActivos,
    error: errorActivos,
  } = useQuery(GET_PEDIDOS_ACTIVOS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  const {
    data: dataPendientes,
    loading: loadingPendientes,
    error: errorPendientes,
  } = useQuery(GET_PEDIDOS_PENDIENTES, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  const {
    data: dataCancelados,
    loading: loadingCancelados,
    error: errorCancelados,
  } = useQuery(GET_PEDIDOS_CANCELADOS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  const {
    data: dataEliminados,
    loading: loadingEliminados,
    error: errorEliminados,
  } = useQuery(GET_PEDIDOS_ELIMINADOS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  const {
    data: dataFiltrados,
    loading: loadingFiltrados,
    error: errorFiltrados,
  } = useQuery(GET_PEDIDOS_FILTRADOS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      filtro: buscarPedidosActivos,
      bbdd: bbddFiltro,
    }
  });


  if (loadingRecogidos) return <div></div>;
  if (errorRecogidos) return console.log(errorRecogidos);

  if (loadingActivos) return <div></div>;
  if (errorActivos) return console.log(errorActivos);

  if (loadingPendientes) return <div></div>;
  if (errorPendientes) return console.log(errorPendientes);

  if (loadingCancelados) return <div></div>;
  if (errorCancelados) return console.log(errorCancelados);

  if (loadingEliminados) return <div></div>;
  if (errorEliminados) return console.log(errorEliminados);

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
            newFechaRecogida: "",
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
      if (newEstado == "Recogido") {
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
    let fechaMañana =
      fecha.getDate() + 1 + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();

    const { value: newFechaRecogida } = await Swal.fire({
      title: "Nueva fecha o estimación de recogida",
      text: `Fecha mínima: ${fechaMañana}`,
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
      <h1 className="text-2xl font-mono text-orange-900 underline mb-10">
        Bases de datos Pedidos
      </h1>

      {dataActivos.getPedidosActivos.length != 0 && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5">
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
                        dataActivos.getPedidosActivos.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarFechaPedidoActivo(
                                  pedidos.estado,
                                  "Activo",
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(
                                  pedidos.estado,
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer underline"
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
                                className="text-red-500 hover:text-red-600 cursor-pointer underline"
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
                        dataFiltrados.getPedidosFiltrados.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarFechaPedidoActivo(
                                  pedidos.estado,
                                  "Activo",
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(
                                  pedidos.estado,
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer underline"
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
                                className="text-red-500 hover:text-red-600 cursor-pointer underline"
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

      {dataPendientes.getPedidosPendientes.length != 0 && (
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
                        dataPendientes.getPedidosPendientes.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarFechaPedidoPendiente(
                                  pedidos.estado,
                                  "Pendiente",
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(
                                  pedidos.estado,
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer underline"
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
                                className="text-red-500 hover:text-red-600 cursor-pointer underline"
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
                        dataFiltrados.getPedidosFiltrados.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarFechaPedidoPendiente(
                                  pedidos.estado,
                                  "Pendiente",
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(
                                  pedidos.estado,
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer underline"
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
                                className="text-red-500 hover:text-red-600 cursor-pointer underline"
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

      {dataCancelados.getPedidosCancelados.length != 0 && (
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
                          Fecha de cancelación
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
                        dataCancelados.getPedidosCancelados.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                            >
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(
                                  pedidos.estado,
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap underline">
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
                        dataFiltrados.getPedidosFiltrados.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                            >
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(
                                  pedidos.estado,
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap underline">
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

      {dataRecogidos.getPedidosRecogidos.length != 0 && (
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
                        dataRecogidos.getPedidosRecogidos.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                            >
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                              onClick={() => {
                                pedidoId = pedidos._id;
                                modalCambiarEstadoPedido(
                                  pedidos.estado,
                                  pedidos.fechaRecogida
                                );
                              }}
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer underline"
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
                        dataFiltrados.getPedidosFiltrados.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                            >
                              {pedidos.fechaRecogida}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hover:text-green-500 underline cursor-pointer"
                            >
                              {pedidos.estado}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a
                                className="text-orange-700 hover:text-orange-900 cursor-pointer underline"
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

      {dataEliminados.getPedidosEliminados.length != 0 && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
            PEDIDOS ELIMINADOS
          </h1>

          <div className="flex flex-row py-3 pl-2">
            <div className="relative max-w-xs">
              <input
                type="text"
                className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                placeholder="Buscar por fecha de eliminación..."
                value={buscarPedidosEliminadosAux}
                onChange={(e) => {
                  setBuscarPedidosEliminadosAux(e.target.value);
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
                  setBbddFiltro("Pedidos_Eliminados");
                  setBuscarPedidosEliminados(buscarPedidosEliminadosAux);
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
                          Fecha de eliminación
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
                      {!buscarPedidosEliminados &&
                        dataEliminados.getPedidosEliminados.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
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

                      {buscarPedidosEliminados &&
                        dataFiltrados.getPedidosFiltrados.map((pedidos) => (
                          <tr key={pedidos._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {pedidos._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.fechaPedido}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importePedido}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {pedidos.importeFreeIvaPedido.substr(0, 5)}€
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
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

export default AllPedidos;
