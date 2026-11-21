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
    const saved = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    return new Set(Array.isArray(saved) ? saved.filter(id => products.some(product => product.id === id)) : []);
  } catch {
    return new Set();
  }
}

let favorites = readFavorites();

function favoriteButton(product) {
  return `<button type="button" class="favorite-button" data-favorite="${product.id}" aria-pressed="false" aria-label="Избранное: ${product.name}">♡</button>`;
}

function updateFavorites() {
  document.querySelectorAll('[data-favorite-count]').forEach(count => {
    count.textContent = favorites.size;
  });
  document.querySelectorAll('[data-favorite]').forEach(button => {
    const selected = favorites.has(button.dataset.favorite);
    button.setAttribute('aria-pressed', String(selected));
    button.textContent = selected ? '♥' : '♡';
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

const featured = document.querySelector('[data-featured]');
if (featured) featured.innerHTML = products.slice(0, 4).map(card).join('');

const catalog = document.querySelector('[data-catalog]');
const filters = document.querySelector('.filters-form');
const favoriteView = params.get('favorites') === '1';

function renderCatalog() {
  const fields = new FormData(filters);
  const search = fields.get('search').trim().toLowerCase();
  const category = fields.get('category');
  const min = fields.get('min');
  const max = fields.get('max');
  const results = products.filter(product => (
    (!favoriteView || favorites.has(product.id)) &&
    (!category || product.category === category) &&
    (!min || product.price >= Number(min)) &&
    (!max || product.price <= Number(max)) &&
    product.name.toLowerCase().includes(search)
  ));
  catalog.innerHTML = results.map(card).join('');
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
    renderCatalog();
  });
  filters.addEventListener('reset', () => requestAnimationFrame(renderCatalog));
  renderCatalog();
}

const productView = document.querySelector('[data-product]');
const productId = params.get('id');
const product = products.find(item => item.id === (productId ?? products[0].id));
const dialog = document.querySelector('.order-dialog');

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
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  try {
    localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
  } catch {
    // Избранное по-прежнему доступно в рамках текущей страницы.
  }
  if (catalog && favoriteView) {
    renderCatalog();
    (catalog.querySelector('[data-favorite]') || document.querySelector('[data-tab="favorites"]')).focus();
  } else updateFavorites();
});

window.addEventListener('storage', event => {
  if (event.key !== favoritesKey && event.key !== null) return;
  favorites = readFavorites();
  if (catalog && favoriteView) renderCatalog();
  else updateFavorites();
});

updateFavorites();

const topButton = document.querySelector('.to-top');
function updateTopButton() {
  topButton.hidden = window.scrollY < 360;
}

window.addEventListener('scroll', updateTopButton, { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0 }));
updateTopButton();
