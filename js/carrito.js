class Carrito {
  constructor() {
    this.productos = [];
  }

  agregarProducto(producto) {
    const existeProducto = this.productos.find((p) => p.SKU === producto.SKU);

    if (existeProducto) {
      existeProducto.unidades += producto.unidades;
      // console.log("Producto existente. Se han actualizado las unidades.");
    } else {
      this.productos.push({ ...producto, unidades: producto.unidades });
      // console.log("Producto agregado al carrito");
    }
  }

  eliminarProducto(sku) {
    const productoAEliminar = this.productos.find((p) => p.SKU === sku);

    if (productoAEliminar) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Este producto se eliminará del carrito.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          productoAEliminar.unidades--;
          if (productoAEliminar.unidades === 0) {
            this.productos = this.productos.filter((p) => p.SKU !== sku);
          }

          Swal.fire({
            title: "Eliminado!",
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
          });

          updateCartTable();
        }
      });
    }
  }

  actualizarUnidades(sku, unidades) {
    const productoToUpdate = this.productos.find((p) => p.SKU === sku);

    if (productoToUpdate && unidades > 0) {
      productoToUpdate.unidades = unidades;
    }
  }

  obtenerInformacionProducto(sku) {
    console.log("Buscando SKU:", sku);

    const productoInfo = this.productos.find((p) => p.SKU === sku);

    if (productoInfo) {
      return {
        sku: productoInfo.SKU,
        nombre: productoInfo.title,
        precio: productoInfo.price,
        unidades: productoInfo.unidades,
      };
    } else {
      console.log("No se encontró el producto con SKU:", sku);
      return null;
    }
  }

  obtenerCarrito() {
    const totalCarrito = this.productos.reduce((total, producto) => {
      console.log(producto);
      return total + producto.price * producto.unidades;
    }, 0);

    return {
      total: totalCarrito.toFixed(2),
      currency: "EUR",
      products: this.productos.map((p) => {
        return {
          sku: p.SKU,
          nombre: p.title,
          precio: p.price,
          unidades: p.unidades,
        };
      }),
    };
  }

  vaciarCarrito() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este acción eliminará todos los productos de tu carrito.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, vaciar carrito!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productos = [];
        updateCartTable();

        Swal.fire({
          title: "Carrito vaciado!",
          text: "Todos los productos han sido eliminados de tu carrito.",
          icon: "success",
          timer: 1400,
          showConfirmButton: false,
        });
      }
    });
  }

  pagar() {
    if (this.productos.length > 0) {
        // Confirmación de pago
        Swal.fire({
            title: '¿Confirmar pago?',
            text: "¿Estás seguro de que quieres realizar la compra?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, pagar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const carritoActual = this.obtenerCarrito();
                console.log(carritoActual);
            
                Swal.fire({
                    title: '¡Compra realizada!',
                    text: `Compra realizada con éxito: ${JSON.stringify(carritoActual)}`,
                    icon: 'success', 
                });

                this.productos = [];
                updateCartTable();
            }
        });
    } else {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'No hay productos en el carrito para realizar la compra.',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
        });
    }
}

}

// TESTs
// const carrito = new Carrito();

// console.log("Agregando productos al carrito");
// carrito.agregarProducto({ sku: '1', nombre: 'Producto 1', precio: 100, unidades: 1 });
// carrito.agregarProducto({ sku: '2', nombre: 'Producto 2', precio: 200, unidades: 1 });
// carrito.agregarProducto({ sku: '3', nombre: 'Eliminar', precio: 200, unidades: 1 });

// carrito.eliminarProducto('2');

// carrito.actualizarUnidades('1', 2);

// carrito.vaciarCarrito();

// //Add
// console.log("Info producto 1 " + JSON.stringify(carrito.obtenerInformacionProducto('1')));

// //Obtener carrito
// console.log(carrito.obtenerCarrito());
