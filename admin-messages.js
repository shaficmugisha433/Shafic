document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('tenant-message-list');
  const count = document.getElementById('tenant-message-count');
  if (!list || !count) return;

  const messages = JSON.parse(localStorage.getItem('rentmanager-tenant-messages') || '[]');
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  count.textContent = `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`;
  list.innerHTML = messages.length ? messages.map(message => `
    <article class="rounded-xl border border-slate-200 p-4">
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h3 class="font-semibold">${escapeHtml(message.subject)}</h3>
          <p class="mt-1 text-xs text-slate-500">${escapeHtml(message.category)} · ${escapeHtml(message.date)} · ${escapeHtml(message.sender || 'Tenant')}</p>
          <p class="mt-3 text-sm leading-6 text-slate-600">${escapeHtml(message.message)}</p>
        </div>
        <span class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">${escapeHtml(message.status || 'Sent')}</span>
      </div>
    </article>`).join('') : '<div class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No tenant messages have been received yet.</div>';
});
