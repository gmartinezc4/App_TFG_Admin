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
  mutation Mutation($idPedido: ID!, $oldEstado: String!, $newEstado: String!) {
    cambiarEstadoPedido(
      id_pedido: $idPedido
      oldEstado: $oldEstado
      newEstado: $newEstado
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

  if (loadingRecogidos) return <div></div>;
  if (errorRecogidos) return console.log(errorRecogidos);

  if (loadingActivos) return <div></div>;
  if (errorActivos) return console.log(errorActivos);

  if (loadingPendientes) return <div></div>;
  if (errorPendientes) return console.log(errorPendientes);

  if (loadingCancelados) return <div></div>;
  if (errorCancelados) return console.log(errorCancelados);

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

  async function modalCambiarEstadoPedido(estadoActual) {
    const { value: estado } = await Swal.fire({
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

    if (estado == estadoActual) {
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
    } else if (estado) {
      cambiarEstadoPedido({
        context: {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        },
        variables: {
          idPedido: pedidoId,
          oldEstado: estadoActual,
          newEstado: estado,
        },
      });

      pedidoId = "";
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
                      {dataActivos.getPedidosActivosUser.map((pedidos) => (
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
                      {dataPendientes.getPedidosPendientesUser.map((pedidos) => (
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
                      {dataCancelados.getPedidosCanceladosUser.map((pedidos) => (
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
                      {dataRecogidos.getPedidosRecogidosUser.map((pedidos) => (
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
