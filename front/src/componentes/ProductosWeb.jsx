import React, { useContext, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Context } from "../context/Context";
import Swal from "sweetalert2";
import Cargando from "./Cargando";

const GET_ALL_PRODUCTOS = gql`
  query Query {
    getProductos {
      _id
      img
      name
      precio
      stock
    }
  }
`;

const BORRAR_PRODUCTO = gql`
  mutation BorrarProducto($idProduct: ID!) {
    borrarProducto(id_product: $idProduct) {
      _id
      img
      name
      precio
      stock
    }
  }
`;

const MODIFICAR_PRODUCTO = gql`
  mutation Mutation(
    $idProduct: ID!
    $img: String
    $name: String
    $stock: String
    $precio: String
  ) {
    modificarProducto(
      id_product: $idProduct
      img: $img
      name: $name
      stock: $stock
      precio: $precio
    ) {
      _id
      img
      name
      precio
      stock
    }
  }
`;

const ADD_PRODUCTO = gql`
  mutation AddProducto($img: String!, $name: String!, $stock: String!, $precio: String!) {
    addProducto(img: $img, name: $name, stock: $stock, precio: $precio) {
      img
      name
      precio
      stock
    }
  }
`;

const GET_PRODCUTOS_FILTRADOS = gql`
  query Query($filtro: String!) {
    getProductosFiltrados(filtro: $filtro) {
      _id
      img
      name
      precio
      stock
    }
  }
`;

//
// * Componente ProductosWeb.
// * Se encarga de mostrar la tabla con los productos disponibles.
//
function ProductosWeb() {
  // Variables del contexto usadas.
  const { changeReload, changeErrorTrue, changeCodigoError, changeMensajeError } =
    useContext(Context);

  const [buscarProducto, setBuscarProducto] = useState("");
  const [buscarProductoAux, setBuscarProductoAux] = useState("");

  // Mutation para borrar un producto.
  const [borrarProducto] = useMutation(BORRAR_PRODUCTO, {
    onCompleted: () => {
      console.log("Se ha eliminado el producto");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha eliminado el producto",
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

  // Mutation para editar un producto.
  const [modificarProducto] = useMutation(MODIFICAR_PRODUCTO, {
    onCompleted: () => {
      console.log("Se ha modificado el producto");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha modificado el producto",
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

  // Mutation para añadir un producto.
  const [addProducto] = useMutation(ADD_PRODUCTO, {
    onCompleted: () => {
      console.log("Se ha añadido el producto");
      changeReload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha añadido el producto",
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

  // Query para traer todos los productos.
  const {
    data: dataGetAllProductos,
    loading: loadingGetAllProductos,
    error: errorGetAllProductos,
  } = useQuery(GET_ALL_PRODUCTOS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
  });

  // Query para traer los productos con un filtro
  const {
    data: dataGetProductosFiltrados,
    loading: loadingGetProductosFiltrados,
    error: errorGetProductosFiltrados,
  } = useQuery(GET_PRODCUTOS_FILTRADOS, {
    context: {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    },
    variables: {
      filtro: buscarProducto,
    },
  });

  if (loadingGetAllProductos || loadingGetProductosFiltrados)
    return (
      <div>
        <Cargando />
      </div>
    );

  if (errorGetAllProductos)
    return (
      <div>
        {changeErrorTrue()} {changeCodigoError(404)}
        {changeMensajeError(errorGetAllProductos.message)}
      </div>
    );

  if (errorGetProductosFiltrados)
    return (
      <div>
        {changeErrorTrue()} {changeCodigoError(404)}
        {changeMensajeError(errorGetProductosFiltrados.message)}
      </div>
    );

  //
  // * Función para borrar un producto.
  // * Realiza la mutation borrarProducto.
  //
  // * idProd: ID del producto a borrar.
  //
  function modalBorrarProducto(idProd) {
    Swal.fire({
      icon: "warning",
      title: "¿Confirmar cambios?",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#DF0000",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        borrarProducto({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idProduct: idProd,
          },
        });
      }
    });
  }

  //
  // * Función para editar un producto.
  // * Realiza la mutation modificarProducto.
  //
  // * idProd: ID del producto a borrar.
  // * img: url actual.
  // * name: nombre actual.
  // * stock: stock actual.
  // * precio: precio actual.
  //
  async function modalModificarProducto(idProd, img, name, stock, precio) {
    const { value: formValues } = await Swal.fire({
      title: "Editar Producto",
      html:
        "<label><strong>Imagen</strong></label>" +
        `<input id="img" value="${img}" class="swal2-input">` +
        "<br></br>" +
        "<label><strong>Nombre</strong></label>" +
        `<input id="name" value="${name}" class="swal2-input">` +
        "<br></br>" +
        "<label><strong>Stock</strong></label>" +
        `<input type="number" id="stock" value="${stock}" class="swal2-input">` +
        "<br></br>" +
        "<label><strong>Precio</strong></label>" +
        `<input type="number" id="precio" value="${precio}" class="swal2-input">`,
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
        document.getElementById("stock").value != "" ||
        document.getElementById("precio").value != ""
      ) {
        modificarProducto({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            idProduct: idProd,
            img: document.getElementById("img").value || "",
            name: document.getElementById("name").value || "",
            stock: document.getElementById("stock").value || "",
            precio: document.getElementById("precio").value || "",
          },
        });
      }
    }
  }

  //
  // * Función para añadir un nuevo producto.
  // * Realiza la mutatuon addProducto.
  //
  async function modalAddProducto() {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Producto",
      html:
        "<label><strong>Imagen</strong></label>" +
        '<input id="img" class="swal2-input" placeholder="Url...">' +
        "<br></br>" +
        "<label><strong>Nombre</strong></label>" +
        '<input id="name" class="swal2-input" placeholder="Nombre...">' +
        "<br></br>" +
        "<label><strong>Stock</strong></label>" +
        '<input type="number" id="stock" class="swal2-input" placeholder="Stock...">' +
        "<br></br>" +
        "<label><strong>Precio</strong></label>" +
        '<input type="number" id="precio" class="swal2-input" placeholder="Precio...">',
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
        document.getElementById("stock").value != "" &&
        document.getElementById("precio").value != ""
      ) {
        addProducto({
          context: {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
          variables: {
            img: document.getElementById("img").value,
            name: document.getElementById("name").value,
            stock: document.getElementById("stock").value,
            precio: document.getElementById("precio").value,
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
          modalAddProducto();
        });
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-mono text-orange-900 mb-10">
          Base de datos Productos_Venta
        </h1>

        {/* Boton para añadir un nuevo producto */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 border border-black hover:border-white rounded"
          onClick={() => {
            modalAddProducto();
          }}
        >
          Añadir producto
        </button>
      </div>

      <div>
        <h1 className="flex justify-center text-2xl underline font-bold mb-5">
          PRODUCTOS
        </h1>

        {/* Buscar en la tabla */}
        <div className="flex flex-row py-3 pl-2">
          <div className="relative max-w-xs">
            <input
              type="text"
              className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
              placeholder="Buscar por nombre..."
              value={buscarProductoAux}
              onChange={(e) => {
                setBuscarProductoAux(e.target.value);
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
              onClick={() => setBuscarProducto(buscarProductoAux)}
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Tabla productos */}
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
                        Stock
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Precio
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
                    {/* Si no hay filtro para buscar */}
                    {!buscarProducto &&
                      dataGetAllProductos.getProductos.map((producto) => (
                        <tr key={producto._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {producto._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-pre-wrap">
                            {producto.img}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.stock}Kg
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.precio}€/Kg
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-green-500 hover:text-green-700 cursor-pointer"
                              onClick={() => {
                                modalModificarProducto(
                                  producto._id,
                                  producto.img,
                                  producto.name,
                                  producto.stock,
                                  producto.precio
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
                                modalBorrarProducto(producto._id);
                              }}
                            >
                              Eliminar
                            </a>
                          </td>
                        </tr>
                      ))}

                    {/* Si hay filtro para buscar */}
                    {buscarProducto &&
                      dataGetProductosFiltrados.getProductosFiltrados.map((producto) => (
                        <tr key={producto._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {producto._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-pre-wrap">
                            {producto.img}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.stock}Kg
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {producto.precio}€/Kg
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-green-500 hover:text-green-700 cursor-pointer"
                              onClick={() => {
                                modalModificarProducto(
                                  producto._id,
                                  producto.img,
                                  producto.name,
                                  producto.stock,
                                  producto.precio
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
                                modalBorrarProducto(producto._id);
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

export default ProductosWeb;
