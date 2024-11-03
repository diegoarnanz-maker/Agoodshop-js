const apiUrl = "https://jsonblob.com/api/1293968868236976128";
let almacen;
let productosApi = [];

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    almacen = data;
    productosApi = almacen.products
    // console.log(productosApi);
    displayProducts();
  })
  .catch(error => console.error("Error al cargar los productos:", error));
