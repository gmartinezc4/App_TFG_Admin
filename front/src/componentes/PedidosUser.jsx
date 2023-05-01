import React, { useContext, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";

const GET_HISTORIAL_PEDIDOS_USER = gql`
  query GetHistorialPedidosUser($idUser: ID!) {
    getHistorialPedidosUser(idUser: $idUser) {
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
  mutation CambiarEstadoPedido($idPedido: ID!, $newEstado: String!) {
    cambiarEstadoPedido(id_pedido: $idPedido, newEstado: $newEstado) {
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
  let idPedido = "";
  const [newEstadoPedido, setNewEstadoPedido] = useState("");

  const { changeViewProductosUser, changeReload } = useContext(Context);

  const [cambiarEstadoPedido] = useMutation(CAMBIAR_ESTADO_PEDIDO, {
    onCompleted: () => {
      console.log("Se ha cambiado el estado del pedido");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Estado del pedido cambiado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      //si hay un error, borrar el token
      console.log(error);
      console.log("dsaf"+ idPedido)
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

  const { data, loading, error } = useQuery(GET_HISTORIAL_PEDIDOS_USER, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      idUser: props.idUser,
    },
  });

  if (loading) return <div></div>;
  if (error) return console.log(error);

  let PedidosActivos = [];
  let PedidosPendientes = [];
  let PedidosHistoricos = [];

  data?.getHistorialPedidosUser.map((pedido) => {
    if (pedido.estado == "Activo") {
      PedidosActivos.push(pedido);
    } else if (pedido.estado == "Pendiente") {
      PedidosPendientes.push(pedido);
    } else {
      PedidosHistoricos.push(pedido);
    }
  });

  async function modalCambiarEstadoPedido() {
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
            idPedido: idPedido,
            newEstado: "Cancelado",
          },
        });
      }
    });
  }

  return (
    <div>
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
                        Name
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
                        {props.nombreUser + " " + props.apellidoUser}
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
                    {PedidosActivos.map((pedidos) => (
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
                          onClick={() => {}}
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
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => {
                              idPedido = pedidos._id
                              modalCambiarEstadoPedido();
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
                    {PedidosPendientes.map((pedidos) => (
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
                          onClick={() => {}}
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
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => {
                              idPedido = pedidos._id
                              modalCambiarEstadoPedido();
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

      <div>
        <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
          PEDIDOS TERMINADOS
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
                    {PedidosHistoricos.map((pedidos) => (
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
                          onClick={() => {}}
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
    </div>
  );
}

export default PedidosUser;
