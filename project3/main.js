const products = [
  {
    id: 1,
    name: "Banana",
    price: 1.0,
    description: "A ripe and sweet banana.",
    image: "/images/banana.jpeg"
  },
  {
    id: 2,
    name: "Strawberry",
    price: 0.2,
    description: "Fresh and juicy strawberry.",
    image: "/images/strawberry.jpg"
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
        <button onclick="alert('${p.description}')">More</button>
      `;
      list.appendChild(div);
    });
  }
  
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
        <p>Total: $${itemTotal}</p>
        <button onclick="removeFromCart(${item.id})">Remove from cart</button>
      `;
      container.appendChild(div);
    });
  
    const totalDiv = document.getElementById("cart-total");
    totalDiv.innerHTML = `<h3>Order Total: $${total}</h3>`;
  }
  
  function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  }
  
  function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    fetch("submit-order.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cart)
    }).then(res => {
      if (res.ok) {
        const total = cart.reduce((sum, item) =>
          sum + item.qty * products.find(p => p.id === item.id).price, 0);
        localStorage.setItem("orderTotal", total);
        localStorage.removeItem("cart");
        window.location.href = "thankyou.html";
      } else {
        alert("Error saving your order.");
      }
    });
  }
  
  
  function renderThankYou() {
    const total = localStorage.getItem("orderTotal");
    const container = document.getElementById("thank-you-message");
    const date = new Date();
    date.setDate(date.getDate() + 2);
    container.innerHTML = `
      <h2>Thank you for your order!</h2>
      <p>Your total is $${total}</p>
      <p>Expected shipping date: ${date.toDateString()}</p>
    `;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderCart();
    renderThankYou();
  });
  