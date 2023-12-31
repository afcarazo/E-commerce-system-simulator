const cartNumber = document.getElementById("cart-items");

window.addEventListener("load", () => {
  let savedCartItems = getItemsCart();
  if (savedCartItems) {
    itemsCart = savedCartItems;
    seeProducts();
  }
});

function refreshItemsCart() {
  cartNumber.innerText = itemsCart.length;
}

/**Add item to card */
function addToCart(item) {
  const length = itemsCart.length + 1;
  const { price, name, img } = item;
  const product = new Product(length, price, name, img);
  itemsCart.push(product);
  cartNumber.innerText = itemsCart.length;
  setItemsCart(itemsCart);
  refreshItemsCart();
}

/**Shows the products in the cart*/
function seeProducts() {
  refreshItemsCart();
  createContainerItems();
  itemsCart.sort((a, b) => a.name.localeCompare(b.name));

  const totalProducts = document.getElementById("total-products");
  const noProducts = document.getElementById("no-products");
  const contResum = document.getElementById("container-resum");

  if (itemsCart.length > 0) {
    totalProducts.innerText = `productos: ${itemsCart.length}`;
    noProducts.style = "display: none;";
    contResum.style = "opacity:1; pointer-events: auto;";
    const productGroups = {};
    let total = 0;
    itemsCart.forEach((item) => {
      total += item.price;
      if (!productGroups[item.name]) {
        productGroups[item.name] = {
          product: item,
          count: 1,
          totalPrice: item.price,
        };
      } else {
        productGroups[item.name].count++;
        productGroups[item.name].totalPrice += item.price; /**aca */
      }
    });

    const totalP = document.getElementById("totalPrice");
    totalP.innerHTML = ` $${total.toFixed(2)}`;

    const totalPrice2 = document.getElementById("totalPrice2");
    totalPrice2.innerHTML = ` $${total.toFixed(2)}`;

    const coupon = document.getElementById("coupon");
    coupon.addEventListener("click", () => handleCoupon(total));

    renderCartItems(productGroups, itemCart);
  } else {
    const noProductsContainer = document.getElementById(
      "no-products-container"
    );
    noProductsContainer.style =
      "background-color: #f2f2f2; border-radius: 10px; opacity: 1;margin-top:15%";
    noProducts.style.display = "block";
    contResum.style.opacity = "0.5";
    contResum.style.pointerEvents = "none";
    itemCart.innerHTML = "";
    totalProducts.innerText = `productos: ${itemsCart.length}`;
  }
}

function renderCartItems(productGroups, itemCart) {
  itemCart.innerHTML = "";
  for (const productName in productGroups) {
    const productGroup = productGroups[productName];
    const item = productGroup.product;
    const count = productGroup.count;
    const totalPrice = productGroup.totalPrice;
    const itemCart = document.getElementById("itemCart");
    let divItem = document.createElement("div");
    divItem.id = "itemCardsList";
    divItem.innerHTML = `
      <div class="row mb-4 d-flex justify-content-between align-items-center">
      <div class="col-md-2 col-lg-2 col-xl-2">
        <img src="${item.img}" class="img-fluid rounded-3">
      </div>
      <div class="col-md-3 col-lg-3 col-xl-3">
        <h6 class="text-muted">${item.name}</h6>
      </div>
      <div class="col-md-3 col-lg-3 col-xl-2">
        <div class="d-flex align-items-center">
          <button id="btn-remove-cart${item.id}" class="btn btn-link px-2">
            <i class="fas fa-minus"></i>
          </button>
    
          <input id="form1" min="0" name="quantity" value="${count}" type="number" disabled=true
            class="form-control form-control-sm custom-input" />
    
          <button class="btn btn-link px-2" id="btn-add-cart${item.id}">
            <i class="fas fa-plus"></i>
          </button>
          <div id="spinner${item.id}" class="col-md-3 col-lg-2 col-xl-2" style="display: none; ">
          <div class="d-flex align-items-center justify-content-end">
          <div class="dot-spinner ml-2">
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
          </div>
        </div>
        </div>
        </div>
      </div>
      <div class="col-md-3 col-lg-2 col-xl-2">
        <h6 class="mb-0">$${totalPrice}</h6>
      </div>
      <div class="col-md-1 col-lg-1 col-xl-1 text-end">
      <a id="delete${item.name}" class="text-danger"  style = "cursor: pointer;"><i class="fas fa-trash fa-lg"></i></a>
    </div>
      <hr class="my-4">
    </div>
    
      `;

    itemCart.append(divItem);
    const btnRemoveItem = document.getElementById(`btn-remove-cart${item.id}`);
    if (count === 1) {
      btnRemoveItem.disabled = true;
    }

    addEventListeners(item, count, divItem);
  }
}

function handleCoupon(total) {
  const totalPrice = document.getElementById("totalPrice");
  const coupon = document.getElementById("couponD");
  const textoIngresado = coupon.value;
  if (textoIngresado === "Bienvenido2023") {
    priceT = total - (total * 10) / 100;
    Toastify({
      text: "Cupón aplicado!",
      duration: 1000,
      style: {
        background: "linear-gradient(to right, #0000c2, #0089bebd)",
        css: {
          fontSize: "15px",
        },
      },
    }).showToast();
    totalPrice.innerHTML = `$${priceT.toFixed(2)}`;
  } else {
    totalPrice.innerHTML = `$${total.toFixed(2)}`;
    Toastify({
      text: "Cupón inválido",
      duration: 1000,
      style: {
        background: "linear-gradient(to right, #0000c2, #0089bebd)",
        css: {
          fontSize: "15px",
        },
      },
    }).showToast();
  }
}

function updateCart() {
  localStorage.setItem("cartItems", JSON.stringify(itemsCart));
  seeProducts();
}

function showSpinner(itemId) {
  let spinner = document.getElementById(`spinner${itemId}`);
  spinner.style.display = "block";
}
function hideSpinner(itemId) {
  let spinner = document.getElementById(`spinner${itemId}`);
  if (spinner) {
    spinner.style.display = "none";
  }
}

function deleteItemByName(itemName) {
  itemsCart = itemsCart.filter((item) => item.name !== itemName);
  setItemsCart(itemsCart);
  Toastify({
    text: "Producto eliminado!",
    duration: 2000,
    style: {
      background: "linear-gradient(to right, #0000c2, #0088be)",
      css: {
        fontSize: "15px",
      },
    },
  }).showToast();
  updateCart();
}

function addEventListeners(item, count, divItem) {
  const deleteI = document.getElementById(`delete${item.name}`);
  deleteI.addEventListener("click", () => deleteItemByName(item.name));

  const btnRemoveItem = document.getElementById(`btn-remove-cart${item.id}`);
  btnRemoveItem.addEventListener("click", () => {
    if (count > 1) {
      let removedIndex = itemsCart.findIndex(
        (product) => product.id === item.id
      );
      btnAddItem.disabled = true;
      btnRemoveItem.disabled = true;
      if (removedIndex !== -1) {
        showSpinner(item.id);
        setTimeout(() => {
          itemsCart.splice(removedIndex, 1);
          updateCart();
          hideSpinner(item.id);
          btnAddItem.disabled = false;
          btnRemoveItem.disabled = false;
        }, 1000);
      }
    }
  });
  const btnAddItem = document.getElementById(`btn-add-cart${item.id}`);
  btnAddItem.addEventListener("click", () => {
    btnAddItem.disabled = true;
    btnRemoveItem.disabled = true;
    showSpinner(item.id);
    setTimeout(() => {
      addToCart(item);
      hideSpinner(item.id);
      btnAddItem.disabled = false;
      btnRemoveItem.disabled = false;
      updateCart();
    }, 1000);
  });
}

function createContainerItems() {
  const cont = document.getElementById("container-cart");
  if (cont) {
    cont.innerHTML = `  <div class="container py-8 h-100">
  <div class="row d-flex justify-content-center align-items-center h-100 ">
      <div class="col-12">
          <div class="card card-registration card-registration-2" style="border-radius: 15px;">
              <div class="card-body p-0">
                  <div class="row g-0">
                      <div class="col-lg-8">
                          <div class="p-5">
                              <div id="itemCart"></div>
                              <div class="text-center p-5" id="no-products-container">
                                  <div id="no-products">
                                      <i class="fas fa-box fa-4x mb-3 text-secondary"></i>
                                      <h4 class="mb-3 text-center my-3">No hay productos para mostrar</h4>
                                      <a href="../index.html" class="btn btn-primary">Ver productos</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div id="container-resum" class="col-lg-4 bg-grey"
                          style="opacity:0.5; pointer-events: none;">
                          <div class="p-5">
                              <h3 class="fw-bold mb-5 mt-2 pt-1">Resumen de compra</h3>
                              <hr class="my-4">

                              <div class="d-flex justify-content-between mb-4">
                                  <h5 id="total-products" class="text-uppercase"> productos: </h5>
                                  <h5 id="totalPrice2"></h5>
                              </div>
                              <h5 class="text-uppercase mb-3">Cupón de descuento</h5>
                              <div class="input-group">
                                  <input id="couponD" class="input" placeholder="Ingrese cupón"
                                      autocomplete="off">
                                  <button class="button--submit" id="coupon">Aplicar</button>
                              </div>
                              <hr class="my-4">

                              <div class="d-flex justify-content-between mb-5">
                                  <h5 class="text-uppercase">Precio total: </h5>
                                  <h5 id="totalPrice"></h5>
                              </div>

                              <a type="button" class="btn btn-dark btn-block btn-lg"
                                  data-mdb-ripple-color="dark" href="../pages/checkout.html">Continuar compra</a>

                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>`;
  }
}
