(() => {
  const root = document.documentElement;
  const key = 'tableworld-theme';

  function readTheme() {
    try {
      return localStorage.getItem(key) === 'dark' ? 'dark' : 'light';
    } catch {
      return root.dataset.theme || 'light';
    }
  }

  root.dataset.theme = readTheme();

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('[data-theme-toggle]');
    const update = theme => {
      root.dataset.theme = theme;
      const dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.title = dark ? 'Включить светлую тему' : 'Включить тёмную тему';
    };
    update(readTheme());

    let transition;
    button.addEventListener('click', event => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      const apply = () => {
        update(theme);
        try {
          localStorage.setItem(key, theme);
        } catch {
          // Тема всё равно меняется на текущей странице.
        }
      };

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        apply();
        return;
      }

      if (!document.startViewTransition) {
        apply();
        root.animate([{opacity: 0.85}, {opacity: 1}], {duration: 240});
        return;
      }

      transition?.skipTransition();
      const bounds = button.getBoundingClientRect();
      const x = event.detail ? event.clientX : bounds.left + bounds.width / 2;
      const y = event.detail ? event.clientY : bounds.top + bounds.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.style.setProperty('--theme-reveal-from', `circle(0px at ${x}px ${y}px)`);
      root.style.setProperty('--theme-reveal-to', `circle(${radius}px at ${x}px ${y}px)`);
      transition = document.startViewTransition(apply);
    });

    window.addEventListener('storage', event => {
      if (event.key === key || event.key === null) update(readTheme());
    });
    window.addEventListener('pageshow', event => {
      if (event.persisted) update(readTheme());
    });
  });
})();
