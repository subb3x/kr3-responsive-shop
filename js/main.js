const categories = {
  family: 'Семейные',
  party: 'Для компании',
  strategy: 'Стратегии',
  expansions: 'Дополнения',
  classic: 'Классические карты'
};

const params = new URLSearchParams(location.search);
const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
});
const favoritesKey = 'tableworld-favorites';

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) ?? '[]');
    const ids = Array.isArray(saved) ? saved : saved?.ids;
    return new Set(Array.isArray(ids) ? ids.filter(id => products.some(product => product.id === id)) : []);
  } catch {
    return null;
  }
}

let favorites = readFavorites() ?? new Set();

function favoriteGames() {
  return products.filter(item => favorites.has(item.id));
}

function favoriteButton(product) {
  return `<button type="button" class="favorite-button" data-favorite="${product.id}" aria-pressed="false" aria-label="Избранное: ${product.name}"><img class="favorites-icon" src="images/heart-outline.svg" width="22" height="22" alt=""></button>`;
}

function updateFavorites() {
  document.querySelectorAll('[data-favorite-count]').forEach(count => {
    count.textContent = favorites.size;
  });
  document.querySelectorAll('[data-favorite]').forEach(button => {
    const selected = favorites.has(button.dataset.favorite);
    button.setAttribute('aria-pressed', String(selected));
    const icon = button.querySelector('.favorites-icon');
    const source = selected ? 'images/heart-selected.svg' : 'images/heart-outline.svg';
    if (icon.getAttribute('src') !== source) icon.setAttribute('src', source);
  });
}

function card(product) {
  const link = `product.html?id=${product.id}`;
  return `<article class="product-card">
    <div class="card-media">
      <a href="${link}" aria-label="${product.name}"><img src="images/games/${product.id}.webp" alt="" width="480" height="480" loading="lazy"></a>
      ${favoriteButton(product)}
    </div>
    <div class="card-body">
      <p class="card-category">${categories[product.category]}</p>
      <h3><a href="${link}">${product.name}</a></h3>
      <p class="card-meta">${product.players} игр. · ${product.minutes} мин · ${product.age}+</p>
      <div class="card-bottom"><strong>${money.format(product.price)}</strong><a href="${link}">Подробнее<span class="sr-only">: ${product.name}</span></a></div>
    </div>
  </article>`;
}

const catalog = document.querySelector('[data-catalog]');
const filters = document.querySelector('.filters-form');
const favoriteView = params.get('favorites') === '1';
const pagination = document.querySelector('[data-pagination]');
const pageSize = 16;
let catalogPage = 1;

function renderCatalog() {
  const fields = new FormData(filters);
  const search = fields.get('search').trim().toLowerCase();
  const category = fields.get('category');
  const min = fields.get('min');
  const max = fields.get('max');
  const games = favoriteView ? favoriteGames() : products;
  const results = games.filter(product => (
    (!category || product.category === category) &&
    (!min || product.price >= Number(min)) &&
    (!max || product.price <= Number(max)) &&
    product.name.toLowerCase().includes(search)
  ));
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  catalogPage = Math.min(catalogPage, pageCount);
  const first = (catalogPage - 1) * pageSize;
  catalog.innerHTML = results.slice(first, first + pageSize).map(card).join('');
  pagination.hidden = pageCount < 2;
  pagination.innerHTML = Array.from({length: pageCount}, (_, index) => {
    const page = index + 1;
    const current = page === catalogPage ? ' aria-current="page"' : '';
    return `<button type="button" data-page="${page}" aria-label="Страница ${page}"${current}>${page}</button>`;
  }).join('');
  document.querySelector('[data-result-count]').textContent = `Найдено: ${results.length}`;
  const empty = document.querySelector('[data-empty]');
  empty.hidden = results.length > 0;
  empty.textContent = favoriteView && !favorites.size
    ? 'Здесь появятся игры, которые вы отметите сердечком.'
    : 'Игры по этим фильтрам не найдены.';
  updateFavorites();
}

if (catalog) {
  const category = params.get('category') || catalog.dataset.category;
  if (Object.hasOwn(categories, category)) filters.elements.category.value = category;
  document.querySelector(`[data-tab="${favoriteView ? 'favorites' : 'all'}"]`).setAttribute('aria-current', 'page');
  if (favoriteView) {
    document.querySelector('[data-catalog-title]').textContent = 'Избранное';
    document.title = 'Избранное — TableWorld';
  }
  filters.addEventListener('submit', event => {
    event.preventDefault();
    catalogPage = 1;
    renderCatalog();
  });
  filters.addEventListener('reset', () => {
    catalogPage = 1;
    requestAnimationFrame(renderCatalog);
  });
  pagination.addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (!button) return;
    catalogPage = Number(button.dataset.page);
    renderCatalog();
    const firstGame = catalog.querySelector('h3 a');
    firstGame.focus({preventScroll: true});
    catalog.scrollIntoView({block: 'start'});
  });
  if (!favoriteView) renderCatalog();
}

const productView = document.querySelector('[data-product]');
const productId = params.get('id');
const product = products.find(item => item.id === (productId ?? products[0].id));
const dialog = document.querySelector('.order-dialog');

const accountFavorites = document.querySelector('[data-account-favorites]');
const accountEmpty = document.querySelector('[data-account-empty]');

function refreshFavoriteViews() {
  if (catalog && favoriteView) {
    renderCatalog();
    return;
  }
  if (accountFavorites) {
    const games = favoriteGames();
    accountFavorites.innerHTML = games.map(card).join('');
    accountEmpty.hidden = games.length > 0;
  }
  updateFavorites();
}

const featured = document.querySelector('[data-featured]');
if (featured) {
  const section = featured.dataset.featured;
  const assortment = ['ticket-to-ride', 'bang', 'azul', 'munchkin-2'];
  const currentCategory = catalog?.dataset.category;
  const selection = products.filter(item => {
    if (section === 'about') return assortment.includes(item.id);
    if (section === 'category') return item.category !== currentCategory;
    return section === 'home' || item.id !== product?.id;
  });
  featured.innerHTML = selection.slice(0, section === 'about' ? 4 : 8).map(card).join('');
}


if (productView && product) {
  document.title = `${product.name} — TableWorld`;
  document.querySelector('[data-product-crumb]').textContent = product.name;
  productView.innerHTML = `<article class="product-details">
    <div class="detail-media">
      <img src="images/games/${product.id}.webp" alt="Коробка игры «${product.name}»" width="480" height="480">
      ${favoriteButton(product)}
    </div>
    <div>
      <p class="eyebrow">${categories[product.category]}</p>
      <h1>${product.name}</h1>
      <p class="lead">${product.description}</p>
      <p class="detail-price">${money.format(product.price)}</p>
      <div class="table-wrapper" tabindex="0" role="region" aria-label="Характеристики игры">
        <table class="product-table">
          <caption>Характеристики</caption>
          <tbody>
            <tr><th scope="row">Игроков</th><td>${product.players}</td></tr>
            <tr><th scope="row">Длительность партии</th><td>${product.minutes} мин</td></tr>
            <tr><th scope="row">Возраст</th><td>${product.age}+</td></tr>
          </tbody>
        </table>
      </div>
      <a class="button" data-order-link href="order.html?id=${product.id}">Оставить заявку</a>
    </div>
  </article>`;
  productView.querySelector('[data-order-link]').addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.showModal();
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
} else if (productView) {
  productView.innerHTML = '<h1>Игра не найдена</h1><a class="button" href="catalog.html">Вернуться в каталог</a>';
}

const order = document.querySelector('.order-form');
if (order) {
  products.forEach(item => order.elements.game.add(new Option(item.name, item.id)));
  if (product && (productId || productView)) order.elements.game.value = product.id;

  order.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(order);
    const game = products.find(item => item.id === fields.get('game'));
    const subject = `${fields.get('topic')} — ${game.name}`;
    const date = fields.get('date');
    const body = [
      `Игра: ${game.name}`,
      `Имя: ${fields.get('name')}`,
      `Телефон: ${fields.get('phone')}`,
      fields.get('email') && `E-mail: ${fields.get('email')}`,
      date && `Дата связи: ${date.split('-').reverse().join('.')}`,
      fields.get('comment') && `Комментарий: ${fields.get('comment')}`
    ].filter(Boolean).join('\n');
    const mailto = `mailto:subb3x@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = order.querySelector('[data-order-status]');
    const link = document.createElement('a');
    link.href = mailto;
    link.textContent = 'Открыть черновик ещё раз';
    status.replaceChildren('Проверьте и отправьте заявку в почтовом приложении. ', link);
    status.hidden = false;
    location.href = mailto;
  });
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-favorite]');
  if (!button) return;
  const id = button.dataset.favorite;
  const nextId = button.closest('.product-card')?.nextElementSibling?.querySelector('[data-favorite]')?.dataset.favorite;
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  try {
    localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
  } catch {
    // Без доступа к хранилищу избранное доступно на текущей странице.
  }
  refreshFavoriteViews();
  const list = accountFavorites || (favoriteView ? catalog : null);
  if (!list) return;
  const focusTarget = list.querySelector(`[data-favorite="${nextId}"]`)
    || list.querySelector('[data-favorite]')
    || accountEmpty
    || document.querySelector('[data-tab="favorites"]');
  focusTarget.focus();
});

function syncFavorites() {
  favorites = readFavorites() ?? favorites;
  refreshFavoriteViews();
}

window.addEventListener('storage', event => {
  if (event.key === favoritesKey || event.key === null) syncFavorites();
});

window.addEventListener('pageshow', event => {
  if (event.persisted) syncFavorites();
});

refreshFavoriteViews();

const topButton = document.querySelector('.to-top');
function updateTopButton() {
  topButton.hidden = window.scrollY < 360;
}

window.addEventListener('scroll', updateTopButton, { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0 }));
updateTopButton();


const accountForm = document.querySelector('[data-account-form]');
if (accountForm) {
  const profileKey = 'tableworld-profile';
  const status = accountForm.querySelector('[data-account-status]');

  try {
    const profile = JSON.parse(localStorage.getItem(profileKey));
    if (profile) {
      accountForm.elements.name.value = profile.name || '';
      accountForm.elements.email.value = profile.email || '';
    }
  } catch {
    // Если профиль недоступен, форма остаётся пустой.
  }

  accountForm.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(accountForm);
    const profile = {name: fields.get('name').trim(), email: fields.get('email').trim()};
    if (!profile.name) {
      status.textContent = 'Введите имя.';
      accountForm.elements.name.focus();
      return;
    }

    try {
      localStorage.setItem(profileKey, JSON.stringify(profile));
      status.textContent = 'Профиль сохранён.';
    } catch {
      status.textContent = 'Браузер не разрешил сохранить профиль.';
    }
  });
}

document.body.insertAdjacentHTML('beforeend', `
  <button class="chat-launch" type="button" aria-expanded="false" aria-controls="consultant-chat">Чат с консультантом</button>
  <section class="chat-widget" id="consultant-chat" aria-labelledby="chat-title" hidden>
    <div class="chat-heading">
      <h2 id="chat-title">Консультант TableWorld</h2>
      <button class="chat-close" type="button" aria-label="Закрыть чат">×</button>
    </div>
    <div class="chat-log" role="log" aria-label="Сообщения" tabindex="0"></div>
    <form class="chat-form">
      <label class="sr-only" for="chat-message">Сообщение</label>
      <input id="chat-message" name="message" placeholder="Ваш вопрос" autocomplete="off" maxlength="1000" required>
      <button class="button" type="submit">Отправить</button>
    </form>
  </section>
`);

const chatLaunch = document.querySelector('.chat-launch');
const chatWidget = document.querySelector('.chat-widget');
const chatLog = chatWidget.querySelector('.chat-log');
const chatForm = chatWidget.querySelector('.chat-form');
const chatInput = chatForm.elements.message;
const chatKey = 'tableworld-chat';
let chatMessages = [];

function readChat() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(chatKey) || '[]');
    if (Array.isArray(stored)) chatMessages = stored.filter(message => typeof message === 'string');
  } catch {
    // В закрытом хранилище история остаётся в памяти страницы.
  }
}

function chatBubble(text, visitor = false) {
  const message = document.createElement('p');
  message.className = visitor ? 'chat-message from-visitor' : 'chat-message';
  message.textContent = text;
  return message;
}

function chatReply() {
  return chatBubble('Консультант скоро ответит.');
}

function scrollChat() {
  chatLog.scrollTop = chatLog.scrollHeight;
}

function setChatOpen(open) {
  chatWidget.hidden = !open;
  chatLaunch.setAttribute('aria-expanded', String(open));
  if (open) {
    readChat();
    chatLog.replaceChildren(...chatMessages.map(text => chatBubble(text, true)));
    if (chatMessages.length) chatLog.append(chatReply());
    else chatLog.append(chatBubble('Здравствуйте! Чем можем помочь?'));
    scrollChat();
    chatInput.focus();
  } else {
    chatLaunch.focus();
  }
}

chatLaunch.addEventListener('click', () => setChatOpen(chatWidget.hidden));
chatWidget.querySelector('.chat-close').addEventListener('click', () => setChatOpen(false));
chatWidget.addEventListener('keydown', event => {
  if (event.key === 'Escape') setChatOpen(false);
});
chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  chatLog.lastElementChild.remove();
  chatMessages.push(message);
  chatLog.append(chatBubble(message, true), chatReply());
  chatInput.value = '';
  scrollChat();
  try {
    sessionStorage.setItem(chatKey, JSON.stringify(chatMessages));
  } catch {
    // Чат продолжает работать на текущей странице.
  }
});
