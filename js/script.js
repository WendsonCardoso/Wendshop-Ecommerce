document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");
  const badge = document.querySelector('.badge');
  const carrinho = document.querySelector('.carrinho');

  //  SOM
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playPop() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }

  // MENU
  if (toggle && menu && overlay) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
      menu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // SUBMENU MOBILE
  document.querySelectorAll('.menu .dropdown > a').forEach(item => {
    item.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.parentElement.classList.toggle('active');
      }
    });
  });

  //  ATUALIZA BADGE PELO LOCALSTORAGE
  function atualizarBadge() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.textContent = total;
  }

  atualizarBadge();

  // BOTÃO + ANIMAÇÃO + SALVAR NO CARRINHO
  document.querySelectorAll('.btn-carrinho').forEach(btn => {

    btn.addEventListener('click', () => {

      playPop();

      const produto = btn.closest('.produto1');
      const img = produto.querySelector('img');
      const nome = produto.querySelector('h3').textContent;
      const precoTexto = produto.querySelector('.preco').textContent;

      const preco = parseFloat(
        precoTexto.replace('R$', '').replace(',', '.')
      );

      //  SALVAR NO LOCALSTORAGE
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(item => item.name === nome);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          name: nome,
          price: preco,
          image: img.getAttribute('src'),
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      atualizarBadge();

      //  ANIMAÇÃO 
      const fly = img.cloneNode(true);
      fly.classList.add('fly-img');

      const imgRect = img.getBoundingClientRect();
      const cartRect = carrinho.getBoundingClientRect();

      fly.style.top = imgRect.top + "px";
      fly.style.left = imgRect.left + "px";

      document.body.appendChild(fly);

      setTimeout(() => {
        fly.style.top = cartRect.top + "px";
        fly.style.left = cartRect.left + "px";
        fly.style.width = "20px";
        fly.style.height = "20px";
        fly.style.opacity = "0.5";
      }, 10);

      setTimeout(() => {
        fly.remove();

        carrinho.classList.add("glow");

        const energia = document.createElement("div");
        energia.classList.add("energia-cart");

        energia.style.top = cartRect.top + "px";
        energia.style.left = cartRect.left + "px";

        document.body.appendChild(energia);

        setTimeout(() => energia.remove(), 600);
        setTimeout(() => carrinho.classList.remove("glow"), 600);

      }, 800);

      // FEEDBACK BOTÃO
      btn.classList.add('added');
      btn.querySelector('span').textContent = "Adicionado";

      setTimeout(() => {
        btn.classList.remove('added');
        btn.querySelector('span').textContent = "Adicionar";
      }, 1500);

    });

  });

  // BUSCA
  const input = document.querySelector('.busca input');
  if (input) {
    input.addEventListener('input', () => {
      const valor = input.value.toLowerCase();

      document.querySelectorAll('.produto1').forEach(prod => {
        const nome = prod.querySelector('h3').textContent.toLowerCase();
        prod.style.display = nome.includes(valor) ? '' : 'none';
      });
    });
  }

  // CARROSSEL
  let index = 0;
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const container = document.querySelector(".slides");
  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");

  if (slides.length && container) {

    function atualizarCarrossel() {
      container.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(dot => dot.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    next.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      atualizarCarrossel();
    });

    prev.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      atualizarCarrossel();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        index = i;
        atualizarCarrossel();
      });
    });

    setInterval(() => {
      index = (index + 1) % slides.length;
      atualizarCarrossel();
    }, 4000);
  }

});