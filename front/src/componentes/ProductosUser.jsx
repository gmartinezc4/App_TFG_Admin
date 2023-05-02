import React, { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";

const GET_PRODUCTOS_PEDIDO_USER = gql`
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

function ProductosUser(props) {
  const { changeViewPedidosUser } = useContext(Context);
 
  return (
    <div>
       <button
        className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 border border-black hover:border-white rounded"
        onClick={() => {changeViewPedidosUser(true)}}
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
                        {props.pedidoUser.id_user}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {props.pedidoUser.nombre + " " + props.pedidoUser.apellido}
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

      <div>
        <h1 className="flex justify-center text-2xl underline font-bold mb-5 mt-10">
          PRODUCTOS PEDIDO
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
                    {props.pedidoUser.productos.map((producto) => (
                      <tr key={producto._id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {producto.id_producto}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {producto.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {producto.cantidad}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {producto.precioTotal}€
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {producto.precioTotal_freeIVA}€
                        </td>
                        <td className="px-6 py-3 text-sm font-medium whitespace-nowrap">
                          <a
                            className="text-red-500 hover:text-red-600 cursor-pointer"
                            onClick={() => {}}
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
    </div>
  );
}

export default ProductosUser;
