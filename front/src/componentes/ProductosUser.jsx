import React, { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";
import Cargando from "./Cargando";

const CANCELAR_PRODUCTO_PEDIDO = gql`
  mutation Mutation($idPedido: ID!, $idProduct: ID!) {
    cancelarProductoPedido(id_pedido: $idPedido, id_product: $idProduct) {
      _id
      apellido
      ciudad
      codigoPostal
      direccion
      email
      estado
      fechaPedido
      id_user
      fechaRecogida
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

const GET_PREODUCTOS_PEDIDO = gql`
  query Query($idPedido: ID!, $estado: String!) {
    getProductosPedido(id_pedido: $idPedido, estado: $estado) {
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
`;

//
// * Componente ProductosUser.
// * Se encarga de motrar las tablas de los productos de
// * los pedidos del usuario.
// 
// * props: pedidoUser y setProductoPedido.
//
function ProductosUser(props) {
  // Variables del contexto usadas
  const {
    changeViewPedidosUser,
    changeViewTodosPedidos,
    volverDeProductos,
    changeReload,
    changeErrorTrue,
    changeCodigoError,
    changeMensajeError,
    changeEnviarCorreoCancelacion
  } = useContext(Context);

  // Mutatuion para cancelar un producto del pedido.
  const [cancelarProductoPedido] = useMutation(CANCELAR_PRODUCTO_PEDIDO, {
    onCompleted: () => {
      console.log("Se ha retirado el producto del pedido");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha retirado el producto del pedido",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        changeEnviarCorreoCancelacion(true);
      });
    },
    onError: (error) => {
      //si hay un error, borrar el token
      console.log(error.message);
      if (
        error.message ==
        "No se puede borrar ese producto. El pedido solo tiene un producto"
      ) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "El pedido solo tiene un producto",
          text: "Opción: cancelar pedido",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#DF0000",
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Ha ocurrido un error",
          text: "Por favor, intentelo de nuevo",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  // Query par traer los productos de un pedido.
  const { data, loading, error } = useQuery(GET_PREODUCTOS_PEDIDO, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      idPedido: props.pedidoUser._id,
      estado: props.pedidoUser.estado,
    },
  });

  if (loading)
    return (
      <div>
        <Cargando />
      </div>
    );

  if (error)
    return (
      <div>
        {changeErrorTrue()} {changeCodigoError(404)}
        {changeMensajeError(error.message)}
      </div>
    );

  //
  // * Función para cancelar un producto de un pedido.
  // * Solo se puede cancelar un producto si hay 2 o más.
  //
  // * idPedido: ID del pedido del que se quiere borrar el producto.
  // * idProduct: ID del producto que se quiere borrar.
  //
  function modalCancelarProductoPedido(idPedido, idProduct, producto) {
    Swal.fire({
      icon: "warning",
      title: "¿Confirmar cambios?",
      showCancelButton: true,
      confirmButtonText: "Si, borrar",
      confirmButtonColor: "#DF0000",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelarProductoPedido({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idPedido: idPedido,
            idProduct: idProduct,
          },
        }).then(() => {
          props.setProductoPedido(producto);
        })
      }
    });
  }

  return (
    <div>
      {/* Si se cumple la condición, volver a las tablas de todos los pedidos. */}
      {volverDeProductos == "AllPedidos" && (
        <button
          className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 border border-black hover:border-white rounded"
          onClick={() => {
            changeViewTodosPedidos(true);
          }}
        >
          volver
        </button>
      )}

      {/* Si se cumple la condición, volver a las tablas de los pedidos del usuario. */}
      {volverDeProductos == "PedidosUser" && (
        <button
          className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 border border-black hover:border-white rounded"
          onClick={() => {
            changeViewPedidosUser(true);
          }}
        >
          volver
        </button>
      )}

      <div>
        {/* Usuario del que es el producto */}
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
                        {props.pedidoUser.id_user}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {props.pedidoUser.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {props.pedidoUser.apellido}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {props.pedidoUser.email}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Si el pedido esta activo o pendiente, se muestra la opción de cancelar producto */}
      {props.pedidoUser.estado == "Activo" && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
            PRODUCTOS PEDIDO
          </h1>

          {/* Tabla de productos del pedido */}
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
                          Nombre
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Cantidad
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
                          Cancelar producto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.getProductosPedido.map((producto) => (
                        <tr key={producto._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {producto.id_producto}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.cantidad}Kg
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.precioTotal}€
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.precioTotal_freeIVA.substr(0, 5)}€
                          </td>
                          <td className="px-6 py-3 text-sm font-medium whitespace-nowrap">
                            <a
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                modalCancelarProductoPedido(
                                  props.pedidoUser._id,
                                  producto.id_producto,
                                  producto
                                );
                              }}
                            >
                              Cancelar producto
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

      {/* Si el pedido no esta activo o pendiente, no se muetra la opción de cancelar producto */}
      {props.pedidoUser.estado != "Activo" && (
        <div>
          <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
            PRODUCTOS PEDIDO
          </h1>

          {/* Tabla de productos del pedido */}
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
                          Nombre
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Cantidad
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.getProductosPedido.map((producto) => (
                        <tr key={producto._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {producto.id_producto}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.cantidad}Kg
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.precioTotal}€
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.precioTotal_freeIVA.substr(0, 5)}€
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

export default ProductosUser;
