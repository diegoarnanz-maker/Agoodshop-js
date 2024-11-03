const carrito = new Carrito();
const payButton = document.getElementById("boton-pagar");
const emptyCartButton = document.getElementById("boton-vaciar");

function displayProducts() {
  const productListElement = document.getElementById("product-list");
  productListElement.innerHTML = "";

  // Por si hay problemas con la API
  if (productosApi.length === 0) {
      const noProductsMessage = document.createElement("p");
      noProductsMessage.textContent = "NO HAY PRODUCTOS DISPONIBLES.";
      noProductsMessage.className = "text-red-500 font-semibold text-center";
      productListElement.appendChild(noProductsMessage);
      return;
  }

  // Creo un contenedor que alojará los productos
  const productContainer = document.createElement("div");
  productContainer.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6";

  productosApi.forEach((product) => {
      // Creo un card para cada producto
      const productCard = document.createElement("div");
      productCard.className = "bg-white shadow-lg rounded-lg p-6";

      const title = document.createElement("h3");
      title.textContent = product.title;
      title.className = "text-xl font-bold text-gray-800 mb-4";

      const price = document.createElement("p");
      price.textContent = `Precio: ${product.price}€`;
      price.className = "text-lg text-green-600 font-medium mb-4";

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "flex flex-col items-center";

      const buttonLessMoreContainer = document.createElement("div");
      buttonLessMoreContainer.className = "flex items-center mb-2";

      const buttonLess = document.createElement("button");
      buttonLess.textContent = "-";
      buttonLess.className = "bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600";

      const textUnidades = document.createElement("span");
      textUnidades.textContent = "1";
      textUnidades.className = "mx-4";

      const buttonMore = document.createElement("button");
      buttonMore.textContent = "+";
      buttonMore.className = "bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600";

      const buttonActionContainer = document.createElement("div");
      buttonActionContainer.className = "flex justify-between mt-4";

      const buttonAdd = document.createElement("button");
      buttonAdd.textContent = "Añadir al carrito";
      buttonAdd.className = "bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-green-600 mr-2";

      buttonLess.addEventListener("click", () => {
          let currentUnits = parseInt(textUnidades.textContent);
          if (currentUnits > 1) {
              currentUnits--;
              textUnidades.textContent = currentUnits;
          }
      });

      buttonMore.addEventListener("click", () => {
          let currentUnits = parseInt(textUnidades.textContent);
          currentUnits++;
          textUnidades.textContent = currentUnits;
      });

      buttonAdd.addEventListener("click", () => {
          const unidades = parseInt(textUnidades.textContent);
          if (unidades > 0) {
              carrito.agregarProducto({ ...product, unidades });
              updateCartTable();
          } else {
              alert("LA CANTIDAD DEBE SER MAYOR QUE CERO.");
          }
      });

      // Agregar los botones al contenedor
      buttonActionContainer.appendChild(buttonAdd);

      buttonLessMoreContainer.appendChild(buttonLess);
      buttonLessMoreContainer.appendChild(textUnidades);
      buttonLessMoreContainer.appendChild(buttonMore);

      buttonContainer.appendChild(buttonLessMoreContainer);
      buttonContainer.appendChild(buttonActionContainer);

      productCard.appendChild(title);
      productCard.appendChild(price);
      productCard.appendChild(buttonContainer);

      productContainer.appendChild(productCard);
  });

  productListElement.appendChild(productContainer);
}


function updateCartTable() {
    const cartTableBody = document.getElementById("cart-table-body");
    const totalCartElement = document.getElementById("total-cart");

    cartTableBody.innerHTML = "";

    let totalCarrito = 0;

    //Creo una fila para cada producto con sus datos: SKU, nombre, precio, unidades, total y botón de eliminar
    carrito.productos.forEach((producto) => {
        const fila = document.createElement("tr");

        const skuTd = document.createElement("td");
        skuTd.className = "py-2 px-4 border text-center";
        skuTd.textContent = producto.SKU;
        fila.appendChild(skuTd);

        const nombreTd = document.createElement("td");
        nombreTd.className = "py-2 px-4 border text-center";
        nombreTd.textContent = producto.title;
        fila.appendChild(nombreTd);

        const precioTd = document.createElement("td");
        precioTd.className = "py-2 px-4 border text-center";
        precioTd.textContent = `${producto.price}€`;
        fila.appendChild(precioTd);

        const unidadesTd = document.createElement("td");
        unidadesTd.className = "py-2 px-4 border text-center";

        const buttonLess = document.createElement("button");
        buttonLess.textContent = "-";
        buttonLess.className = "bg-red-500 text-white font-semibold px-2 py-1 rounded hover:bg-red-600";
        buttonLess.addEventListener("click", () => {
            if (producto.unidades > 1) {
                producto.unidades--;
                updateCartTable();
            }
        });

        const textUnidades = document.createElement("span");
        textUnidades.textContent = producto.unidades;
        textUnidades.className = "mx-2";

        const buttonMore = document.createElement("button");
        buttonMore.textContent = "+";
        buttonMore.className = "bg-blue-500 text-white font-semibold px-2 py-1 rounded hover:bg-blue-600";
        buttonMore.addEventListener("click", () => {
            producto.unidades++;
            updateCartTable();
        });

        unidadesTd.appendChild(buttonLess);
        unidadesTd.appendChild(textUnidades);
        unidadesTd.appendChild(buttonMore);

        fila.appendChild(unidadesTd);

        const totalProducto = producto.price * producto.unidades;
        totalCarrito += totalProducto;

        const totalTd = document.createElement("td");
        totalTd.className = "py-2 px-4 border text-center";
        totalTd.textContent = `${totalProducto.toFixed(2)}€`;
        fila.appendChild(totalTd);

        const accionesTd = document.createElement("td");
        accionesTd.className = "py-2 px-4 border text-center";

        const infoButton = document.createElement("button");
        infoButton.className =
            "bg-blue-500 text-white font-semibold px-2 py-1 mr-2 rounded hover:bg-blue-600";
        infoButton.textContent = "Info";

        const deleteButton = document.createElement("button");
        deleteButton.className =
            "bg-red-500 text-white font-semibold px-2 py-1 rounded hover:bg-red-600";
        deleteButton.textContent = "Eliminar";
        
        deleteButton.addEventListener("click", () => {
            carrito.eliminarProducto(producto.SKU);
            updateCartTable();
        });

        infoButton.addEventListener("click", () => {
            alert(JSON.stringify(carrito.obtenerInformacionProducto(producto.SKU)));
        });

        accionesTd.appendChild(infoButton);
        accionesTd.appendChild(deleteButton);
        fila.appendChild(accionesTd);

        cartTableBody.appendChild(fila);
    });

    totalCartElement.textContent = `${totalCarrito.toFixed(2)} €`;
}

// PODRIA AÑADIR ESTOS BOTONES EN EL UPDATECARTTABLE, PERO QUIERO QUE ESTÉN SIEMPRE PRESENTES EN EL HTML
payButton.addEventListener("click", () => {
  carrito.pagar();
});

emptyCartButton.addEventListener("click", () => {
  carrito.vaciarCarrito();
  updateCartTable();
});
