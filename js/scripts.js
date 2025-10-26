// Variables principales
const cartToggle = document.getElementById("cart-toggle");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.querySelector(".close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.querySelector(".cart-count");
const totalElement = document.getElementById("total");
const whatsappBtn = document.getElementById("whatsapp-btn");

// Crear contenedor de alertas si no existe
let alertContainer = document.createElement("div");
alertContainer.className = "custom-alert-container";
document.body.appendChild(alertContainer);

// Función para mostrar alerta moderna
function showAlert(message, type = "success") {
  const alert = document.createElement("div");
  alert.className = `custom-alert ${type}`;
  alert.innerHTML = `
    <span>${message}</span>
  `;
  alertContainer.appendChild(alert);

  // Animación de entrada y salida automática
  setTimeout(() => alert.classList.add("show"), 10);
  setTimeout(() => {
    alert.classList.remove("show");
    setTimeout(() => alert.remove(), 400);
  }, 1800);
}

// Cargar carrito desde localStorage o crear uno vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Actualiza el contador del carrito y el total
function updateCartDisplay() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.nombre}</strong><br>
        <small>$${item.precio.toLocaleString()}</small>
      </div>
      <div class="cart-item-actions">
        <button class="remove-btn" data-index="${index}">🗑️</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
    total += item.precio;
  });

  totalElement.textContent = `$${total.toLocaleString()}`;
  cartCount.textContent = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Mostrar / ocultar carrito
cartToggle.addEventListener("click", () => cartModal.classList.toggle("open"));
closeCart.addEventListener("click", () => cartModal.classList.remove("open"));

// Agregar producto al carrito
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const nombre = button.getAttribute("data-nombre");
    const precio = parseInt(button.getAttribute("data-precio"));

    cart.push({ nombre, precio });
    updateCartDisplay();

    // Mostrar alerta moderna al agregar producto
    showAlert(`✅ "${nombre}" fue agregado al carrito.`, "success");

    // Animación visual de agregado
    button.textContent = "✅ Agregado";
    setTimeout(() => (button.textContent = "Agregar"), 1200);
  });
});

// Eliminar productos del carrito
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.getAttribute("data-index");
    const nombreEliminado = cart[index].nombre;

    cart.splice(index, 1);
    updateCartDisplay();

    // Mostrar alerta moderna al eliminar producto
    showAlert(`🗑️ "${nombreEliminado}" fue eliminado del carrito.`, "error");
  }
});

// Enviar pedido por WhatsApp
whatsappBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showAlert("🛒 Tu carrito está vacío 😅", "warning");
    return;
  }

  const mensaje = cart
    .map((item) => `• ${item.nombre} - $${item.precio.toLocaleString()}`)
    .join("%0A");

  const total = cart.reduce((sum, item) => sum + item.precio, 0);
  const texto = `🛍️ *Pedido MegaProm*:%0A${mensaje}%0A--------------------%0ATotal: $${total.toLocaleString()}%0A%0A👤 Quiero más información sobre estos productos.`;

  const telefono = "573215508152"; // WhatsApp MegaProm
  window.open(`https://wa.me/${telefono}?text=${texto}`, "_blank");
});

// Inicializar visualmente al cargar
updateCartDisplay();



