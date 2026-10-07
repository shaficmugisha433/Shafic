document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuButton = document.getElementById('mobile-menu-button');

  if (menuButton && sidebar && overlay) {
    menuButton.addEventListener('click', () => {
      const open = sidebar.classList.toggle('is-open');
      overlay.classList.toggle('hidden', !open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      overlay.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  }

  const themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    const saved = localStorage.getItem('rentmanager-theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    themeButton.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('rentmanager-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  document.querySelectorAll('[data-search]').forEach(input => {
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      document.querySelectorAll('[data-searchable]').forEach(row => {
        row.classList.toggle('hidden', Boolean(query && !row.dataset.searchable.toLowerCase().includes(query)));
      });
    });
  });

  document.querySelectorAll('[data-filter-status]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-status]').forEach(item => item.classList.remove('bg-indigo-600', 'text-white'));
      button.classList.add('bg-indigo-600', 'text-white');
      const status = button.dataset.filterStatus;
      document.querySelectorAll('[data-status-row]').forEach(row => {
        row.classList.toggle('hidden', status !== 'all' && row.dataset.statusRow !== status);
      });
    });
  });

  document.querySelectorAll('[data-record-payment]').forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const tenant = row.querySelector('[data-tenant]').textContent;
      const amount = row.querySelector('[data-amount]').textContent;
      row.querySelector('[data-status]').textContent = 'Paid';
      row.querySelector('[data-status]').className = 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700';
      button.textContent = 'Paid';
      button.disabled = true;
      showToast(`${tenant} payment of ${amount} recorded successfully.`);
    });
  });

  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => showToast(`Action completed: ${button.dataset.action}`));
  });

  document.querySelectorAll('[data-confirm]').forEach(button => {
    button.addEventListener('click', () => {
      if (window.confirm(button.dataset.confirm)) showToast('Changes saved successfully.');
    });
  });
});

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('translate-y-6', 'opacity-0', 'pointer-events-none');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.add('translate-y-6', 'opacity-0', 'pointer-events-none'), 3200);
}
