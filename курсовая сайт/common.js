//  Товары (для корзины и избранного) 
const products = [
  {
    id: 1,
    name: "Орден Ленина",
    price: 3500,
    img: "resize-no-bg-preview (carve.photos).png",
  },
  {
    id: 2,
    name: "Орден Красной Звезды",
    price: 3200,
    img: "ndptydgbmh0i3szeysn4hhvebt8dmjgw-no-bg-preview (carve.photos).png",
  },
  {
    id: 3,
    name: "Орден Отечественной войны",
    price: 4100,
    img: "7200331923-no-bg-preview (carve.photos).png",
  },
  {
    id: 4,
    name: "Медаль «За отвагу»",
    price: 1800,
    img: "orig-no-bg-preview (carve.photos).png",
  },
  {
    id: 5,
    name: "Медаль «За безупречную службу»",
    price: 1600,
    img: "6387689298-no-bg-preview (carve.photos).png",
  },
  {
    id: 6,
    name: "Знак «За заслуги»",
    price: 700,
    img: "1464937_mainViewLot_2x-no-bg-preview (carve.photos).png",
  },
  {
    id: 7,
    name: "Медаль «Ветерану боевых действий»",
    price: 1500,
    img: "ka0r0vs9lkub3yrq3dydq32p0bkyryki-no-bg-preview (carve.photos).png",
  },
  {
    id: 8,
    name: "Знак «Участник боевых действий»",
    price: 1200,
    img: "7182945832-no-bg-preview (carve.photos).png",
  },
  {
    id: 100,
    name: "Футляр для ордена",
    price: 450,
    img: "c:/Users/User/Downloads/orig1-Photoroom.png",
  },
  {
    id: 101,
    name: "Футляр для медали",
    price: 400,
    img: "херсон (12).зтп-Photoroom.png",
  },
  {
    id: 102,
    name: "Планшет для наград",
    price: 1200,
    img: "shop_property_file_6366_220-Photoroom.png",
  },
];

let currentUser = null;
let cart = [];
let favorites = [];

// DOM элементы
const authBar = document.getElementById("authBar");
const authModal = document.getElementById("authModal");
const closeModalBtn = document.getElementById("closeModal");
const submitAuthBtn = document.getElementById("submitAuth");
const authNameInput = document.getElementById("authName");
const authEmailInput = document.getElementById("authEmail");
const cartCountSpan = document.getElementById("cartCount");
const favoritesCountSpan = document.getElementById("favoritesCount");

// ---------- СОХРАНЕНИЕ/ЗАГРУЗКА ----------
function saveUserSession() {
  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } else {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
  }
}

function loadUserSession() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    currentUser = JSON.parse(user);
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
    favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    updateAuthUI();
    updateCounters();
  } else {
    currentUser = null;
    cart = [];
    favorites = [];
    updateAuthUI();
    updateCounters();
  }
}

// Авторизация
function updateAuthUI() {
  if (currentUser) {
    authBar.innerHTML = `
            <div class="user-info">
                <span>Привет, ${currentUser.name}!</span>
                <button class="logout-btn" id="logoutBtn">Выйти</button>
            </div>
        `;
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
  } else {
    authBar.innerHTML = `
            <button class="auth-btn" id="loginBtn">Войти</button>
            <button class="auth-btn" id="registerBtn">Регистрация</button>
        `;
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    if (loginBtn) loginBtn.addEventListener("click", () => openModal());
    if (registerBtn) registerBtn.addEventListener("click", () => openModal());
  }
  updateTooltips();
  updateButtonsState(); // если функция есть на странице
}

function logout() {
  currentUser = null;
  cart = [];
  favorites = [];
  saveUserSession();
  updateAuthUI();
  updateCounters();
  if (typeof renderCart === "function") renderCart();
  if (typeof renderFavorites === "function") renderFavorites();
  if (typeof renderProfile === "function") renderProfile();
}

function openModal() {
  if (authModal) authModal.classList.add("active");
}
function closeModal() {
  if (authModal) authModal.classList.remove("active");
  if (authNameInput) authNameInput.value = "";
  if (authEmailInput) authEmailInput.value = "";
}
function handleAuth() {
  const name = authNameInput ? authNameInput.value.trim() : "";
  const email = authEmailInput ? authEmailInput.value.trim() : "";
  if (!name || !email) {
    alert("Введите имя и email");
    return;
  }
  currentUser = { name, email };
  cart = [];
  favorites = [];
  saveUserSession();
  closeModal();
  updateAuthUI();
  updateCounters();
  if (typeof renderCart === "function") renderCart();
  if (typeof renderFavorites === "function") renderFavorites();
  if (typeof renderProfile === "function") renderProfile();
}

// ---------- КОРЗИНА ----------
function addToCart(productId) {
  if (!currentUser) {
    alert("Войдите в аккаунт, чтобы добавлять товары в корзину");
    return false;
  }
  const product = products.find((p) => p.id === productId);
  if (!product) return false;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveUserSession();
  updateCounters();
  if (typeof renderCart === "function") renderCart();
  return true;
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveUserSession();
  updateCounters();
  if (typeof renderCart === "function") renderCart();
}

function updateQuantity(productId, delta) {
  const idx = cart.findIndex((i) => i.id === productId);
  if (idx !== -1) {
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    saveUserSession();
    updateCounters();
    if (typeof renderCart === "function") renderCart();
  }
}

// ---------- ИЗБРАННОЕ ----------
function toggleFavorite(productId) {
  if (!currentUser) {
    alert("Войдите в аккаунт, чтобы добавлять в избранное");
    return false;
  }
  const index = favorites.indexOf(productId);
  if (index === -1) {
    favorites.push(productId);
  } else {
    favorites.splice(index, 1);
  }
  saveUserSession();
  updateCounters();
  if (typeof renderFavorites === "function") renderFavorites();
  if (typeof updateButtonsState === "function") updateButtonsState();
  return true;
}

// ---------- ОБНОВЛЕНИЕ СЧЁТЧИКОВ ----------
function updateCounters() {
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  if (cartCountSpan) cartCountSpan.textContent = totalItems;
  if (favoritesCountSpan) favoritesCountSpan.textContent = favorites.length;
}

function updateTooltips() {
  const cartLink = document.querySelector('.icon-link[href="cart.html"]');
  const favLink = document.querySelector('.icon-link[href="favorites.html"]');
  if (cartLink) {
    cartLink.title = currentUser
      ? "Корзина"
      : "Войдите в аккаунт, чтобы открыть корзину";
  }
  if (favLink) {
    favLink.title = currentUser
      ? "Избранное"
      : "Войдите в аккаунт, чтобы открыть избранное";
  }
}

// ---------- НАВЕШИВАНИЕ ОБРАБОТЧИКОВ (для главной) ----------
function attachEventListeners() {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.removeEventListener("click", btn._cartHandler);
    const handler = (e) => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    };
    btn.addEventListener("click", handler);
    btn._cartHandler = handler;
  });

  document.querySelectorAll(".favorite-link").forEach((link) => {
    link.removeEventListener("click", link._favHandler);
    const handler = (e) => {
      e.preventDefault();
      const id = parseInt(link.dataset.id);
      toggleFavorite(id);
    };
    link.addEventListener("click", handler);
    link._favHandler = handler;
  });
}

function updateButtonsState() {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    if (!currentUser) {
      btn.classList.add("disabled");
      btn.disabled = true;
    } else {
      btn.classList.remove("disabled");
      btn.disabled = false;
    }
  });

  document.querySelectorAll(".favorite-link").forEach((link) => {
    const id = parseInt(link.dataset.id);
    let img = link.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      img.width = 20;
      img.height = 20;
      link.appendChild(img);
    }
    if (!currentUser) {
      link.classList.add("disabled");
      link.style.pointerEvents = "none";
      img.src =
        "png-transparent-computer-icons-bookmark-others-lov-no-bg-preview (carve.photos).png";
      img.alt = "В избранное";
    } else {
      link.classList.remove("disabled");
      link.style.pointerEvents = "auto";
      if (favorites.includes(id)) {
        img.src =
          "png-transparent-heart-heart-heart-shaped-red-heart-shaped-Photoroom.png";
        img.alt = "В избранном";
      } else {
        img.src =
          "png-transparent-computer-icons-bookmark-others-lov-no-bg-preview (carve.photos).png";
        img.alt = "В избранное";
      }
    }
  });
}

// ---------- ИНИЦИАЛИЗАЦИЯ ----------
function initCommon() {
  loadUserSession();
  if (document.querySelector(".add-to-cart")) {
    attachEventListeners();
    updateButtonsState();
  }
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (submitAuthBtn) submitAuthBtn.addEventListener("click", handleAuth);
  window.addEventListener("click", (e) => {
    if (e.target === authModal) closeModal();
  });
}

// Делаем глобальные функции для использования в onclick
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.toggleFavorite = toggleFavorite;
window.openModal = openModal;

initCommon();
