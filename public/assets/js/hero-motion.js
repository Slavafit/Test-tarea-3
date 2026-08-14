const root = document.documentElement;

requestAnimationFrame(() => {
  root.classList.add('hero-motion-ready');
});

const logos = document.querySelector('#logos');

if (logos) {
  logos.querySelectorAll('.dds-marquee-item').forEach((item, index) => {
    item.style.setProperty('--logo-index', String(index));
  });

  const revealLogos = () => {
    logos.classList.add('is-logos-revealed');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealLogos();
      observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(logos);
  } else {
    revealLogos();
  }
}

const menuToggle = document.querySelector('#dds-main-toggle');
const menuButton = document.querySelector('.dds-main-burger');
const menu = document.querySelector('#dds-main-menu');
const compactHeader = window.matchMedia('(max-width: 1023px)');

if (menuToggle && menuButton && menu) {
  const menuItems = () => Array.from(menu.querySelectorAll('a[href]'));

  const syncMenu = ({ focusFirst = false, restoreFocus = false } = {}) => {
    const isOpen = compactHeader.matches && menuToggle.checked;
    document.documentElement.classList.toggle('dds-menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen && focusFirst) {
      requestAnimationFrame(() => menuItems()[0]?.focus());
    } else if (!isOpen && restoreFocus) {
      menuButton.focus();
    }
  };

  menuToggle.addEventListener('change', () => {
    syncMenu({ focusFirst: menuToggle.checked });
  });

  menuButton.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    menuToggle.checked = !menuToggle.checked;
    syncMenu({ focusFirst: menuToggle.checked, restoreFocus: !menuToggle.checked });
  });

  menu.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    menuToggle.checked = false;
    syncMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (!menuToggle.checked || !compactHeader.matches) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      menuToggle.checked = false;
      syncMenu({ restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [menuButton, ...menuItems()];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const handleBreakpointChange = () => {
    if (!compactHeader.matches) menuToggle.checked = false;
    syncMenu();
  };
  compactHeader.addEventListener('change', handleBreakpointChange);
  syncMenu();
}
