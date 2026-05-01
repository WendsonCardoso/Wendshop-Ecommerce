let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cartItems");
const empty = document.getElementById("emptyCart");
const modal = document.getElementById("modal");

function format(v){
  return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function render(){
  container.innerHTML = "";

  if(cart.length === 0){
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
  }

  let subtotal = 0;

  cart.forEach((item,i)=>{
    subtotal += item.price * item.quantity;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div class="info">
          <h3>${item.name}</h3>
          <p>${format(item.price)}</p>
          <span class="remove" onclick="removeItem(${i})">Remover</span>
        </div>

        <div class="controls">
          <button onclick="changeQty(${i},-1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${i},1)">+</button>
        </div>
      </div>
    `;
  });

  const frete = subtotal > 0 ? 15 : 0;
  const total = subtotal + frete;

  document.getElementById("subtotal").innerText = format(subtotal);
  document.getElementById("frete").innerText = format(frete);
  document.getElementById("total").innerText = format(total);

  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(i,v){
  cart[i].quantity += v;
  if(cart[i].quantity <= 0) cart.splice(i,1);
  render();
}

function removeItem(i){
  cart.splice(i,1);
  render();
}

document.querySelector(".checkout").onclick = ()=>{
  if(cart.length === 0){
    alert("Seu carrinho está vazio.");
    return;
  }

  modal.style.display = "flex";

  cart = [];
  localStorage.removeItem("cart");

  render();
};

function closeModal(){
  modal.style.display = "none";
  window.location.href = "index.html";
}

render();