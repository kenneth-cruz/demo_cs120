// array of my 5 fruits for hippo mart.

const products = [
  {
    id: 1,
    name: "Banana",
    price: 1.0,
    description: "A ripe and sweet banana.",
    image: "images/banana.jpg"
  },
  {
    id: 2,
    name: "Strawberry",
    price: 0.2,
    description: "Fresh and juicy strawberry.",
    image: "images/strawberry.jpg"
  },
  {
    id: 3,
    name: "Avocado",
    price: 1.50,
    description: "Ripe avocado, creamy.",
    image: "images/avocado.jpeg"
  },
  {
    id: 4,
    name: "Mango",
    price: 1.75,
    description: "Juicy and sweet mango.",
    image: "images/mango.jpeg"
  },
  {
    id: 5,
    name: "Apple",
    price: 0.6,
    description: "Crisp, sweet, and ready to eat apple.",
    image: "images/apple.jpg"
  }
];

// Renders all products as HTML page products page

function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" width="150">
      <h2>${p.name}</h2>
      <p>$${p.price}</p>
      <select id="qty-${p.id}">
        ${[1,2,3,4,5].map(n => `<option value="${n}">${n}</option>`).join('')}
      </select>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      <button onclick="toggleDescription(${p.id})">More</button>
      <div id="desc-${p.id}" class="description" style="display: none; margin-top: 10px;">
        <p>${p.description}</p>
      </div>
    `;
    list.appendChild(div);
  });
}

// click on the more button to see description

function toggleDescription(id) {
  const desc = document.getElementById(`desc-${id}`);
  if (desc) {
    desc.style.display = desc.style.display === "none" ? "block" : "none";
  }
}

// add to localstorage cart
function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const item = cart.find(i => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "cart.html";
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const container = document.getElementById("cart-items");
  if (!container) return;

  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    const itemTotal = product.price * item.qty;
    total += itemTotal;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Qty: ${item.qty}</p>
      <p>Price: $${product.price}</p>
      <p>Total: $${itemTotal.toFixed(2)}</p>
      <button onclick="removeFromCart(${item.id})">Remove from cart</button>
    `;
    container.appendChild(div);
  });

  // do the summation to get your order total, appear as new div

  const totalDiv = document.getElementById("cart-total");
  if (totalDiv) {
    totalDiv.innerHTML = `Order Total: $${total.toFixed(2)}`;
  }
}

//page refresh + removing cart item

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  console.log("Cart items:", cart);

  fetch("submit-order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart)
  }).then(async res => {
    const message = await res.text();
    if (res.ok) {
      const total = cart.reduce((sum, item) =>
        sum + item.qty * products.find(p => p.id === item.id).price, 0);
      localStorage.setItem("orderTotal", total);
      localStorage.removeItem("cart");
      window.location.href = "thankyou.html";
    } else {
      alert("Error saving order:\n" + message);
    }
  });
}

function renderThankYou() {
  const container = document.getElementById("thank-you-message");
  if (!container) return;

  const total = localStorage.getItem("orderTotal");
  const date = new Date();
  date.setDate(date.getDate() + 2);

  container.innerHTML = `
    <h2>Thank you for ordering from E-Hippo-Mart!</h2>
    <p>Your total is $${parseFloat(total).toFixed(2)}</p>
    <p>Expected shipping date: ${date.toDateString()}</p>
  `;

  localStorage.removeItem("orderTotal");
}

// Loads previous orders from the backend and displays on html page
// orders display as cards
function renderOrders() {
  const container = document.getElementById("order-history");
  if (!container) return;

  fetch("get-orders.php")
    .then(res => res.json())
    .then(data => {
      console.log("Full order data (array):", data); 

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = "<p>No orders found.</p>";
        return;
      }

      data.forEach(order => {
        const div = document.createElement("div");
        div.className = "order";

        const date = new Date(order.date + ' UTC').toLocaleString("en-US", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit"
        });

        const itemsHTML = order.items.map(item =>
          `<li>${item.name} - Qty: ${item.qty} - $${item.price.toFixed(2)} each = $${item.subtotal.toFixed(2)}</li>`
        ).join("");

        div.innerHTML = `
          <h3>Order #${order.id}</h3>
          <p><strong>Date:</strong> ${date}</p>
          <ul>${itemsHTML}</ul>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        `;

        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error loading these orders!:", err);
      container.innerHTML = "<p>Error loading your orders!</p>";
    });
}

// when page loads, run this
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  renderThankYou();
  renderOrders();
});
