document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const sections = [...document.querySelectorAll('.tenant-section')];
  const title = document.getElementById('tenant-page-title');
  const sectionNames = {
    dashboard: 'My Dashboard',
    payments: 'Payments',
    rooms: 'Rooms & Availability',
    complaints: 'Complaints & Messages',
    documents: 'My Documents'
  };

  const showSection = sectionId => {
    sections.forEach(section => section.classList.toggle('hidden', section.id !== `${sectionId}-section`));
    title.textContent = sectionNames[sectionId];
    document.querySelectorAll('.tenant-nav-item').forEach(item => {
      item.classList.toggle('bg-indigo-600', item.dataset.section === sectionId);
      item.classList.toggle('text-white', item.dataset.section === sectionId);
      item.classList.toggle('text-slate-300', item.dataset.section !== sectionId);
    });
    document.getElementById('tenant-sidebar')?.classList.remove('is-open');
  };

  document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => showSection(button.dataset.section)));
  document.querySelectorAll('[data-section-link]').forEach(button => button.addEventListener('click', () => showSection(button.dataset.sectionLink)));

  const menuButton = document.getElementById('tenant-menu-button');
  const sidebar = document.getElementById('tenant-sidebar');
  if (menuButton && sidebar) {
    menuButton.addEventListener('click', () => sidebar.classList.toggle('hidden'));
  }

  const themeToggle = document.getElementById('tenant-theme-toggle');
  if (themeToggle) {
    const saved = localStorage.getItem('tenant-theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('tenant-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  const availableRooms = [
    { name: 'Single Room', area: 'Kampala · East Division', rent: 'UGX 650,000', available: true },
    { name: 'Shared Room', area: 'Kampala · Central', rent: 'UGX 480,000', available: true },
    { name: 'Studio Apartment', area: 'Kampala · West', rent: 'UGX 1,200,000', available: true },
    { name: '2-Bedroom Apartment', area: 'Kampala · North', rent: 'UGX 1,800,000', available: true }
  ];

  const renderRooms = () => {
    const list = document.getElementById('room-list');
    list.innerHTML = availableRooms.map(room => `
      <div class="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p class="font-semibold">${room.name}</p><p class="mt-1 text-xs text-slate-500">${room.area}</p></div>
        <div class="flex items-center gap-4"><strong class="text-sm">${room.rent}/mo</strong><span class="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Available</span></div>
      </div>`).join('');
  };
  renderRooms();

  document.getElementById('room-request-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const roomType = document.getElementById('room-type').value;
    const budget = document.getElementById('room-budget').value;
    const moveIn = document.getElementById('room-move-in').value;
    const message = document.getElementById('room-message').value.trim();
    const request = { roomType, budget, moveIn, message, id: Date.now(), status: 'Pending' };
    const requests = JSON.parse(localStorage.getItem('tenant-room-requests') || '[]');
    requests.unshift(request);
    localStorage.setItem('tenant-room-requests', JSON.stringify(requests));
    renderRoomRequests();
    showTenantModal(`Your room request for ${roomType.toLowerCase()} was submitted. Your preferred move-in date is ${moveIn || 'not specified'}.`);
    event.target.reset();
  });

  const renderRoomRequests = () => {
    const list = document.getElementById('room-request-list');
    const requests = JSON.parse(localStorage.getItem('tenant-room-requests') || '[]');
    list.innerHTML = requests.length ? requests.map(request => `
      <div class="rounded-xl border border-slate-200 p-4"><div class="flex flex-col justify-between gap-3 sm:flex-row"><div><p class="font-semibold">${request.roomType}</p><p class="mt-1 text-xs text-slate-500">Budget: ${request.budget} · Move-in: ${request.moveIn || 'To be confirmed'}</p><p class="mt-2 text-sm text-slate-600">${request.message || 'No additional message.'}</p></div><span class="self-start rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">${request.status}</span></div></div>`).join('') : '<div class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No room requests have been submitted yet.</div>';
  };
  renderRoomRequests();

  let selectedPayment = 'MTN Mobile Money';
  document.querySelectorAll('.payment-method').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.payment-method').forEach(item => item.classList.remove('border-indigo-500', 'bg-indigo-50'));
    button.classList.add('border-indigo-500', 'bg-indigo-50');
    selectedPayment = button.dataset.paymentMethod;
    document.getElementById('selected-payment-method').textContent = selectedPayment;
  }));
  document.getElementById('confirm-payment')?.addEventListener('click', () => {
    showTenantModal(`${selectedPayment} payment request for UGX 850,000 was confirmed. Complete the payment using your selected wallet or bank service.`);
  });

  document.getElementById('complaint-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const subject = document.getElementById('complaint-subject').value.trim();
    const category = document.getElementById('complaint-category').value;
    const message = document.getElementById('complaint-message').value.trim();
    const complaints = JSON.parse(localStorage.getItem('rentmanager-tenant-messages') || '[]');
    complaints.unshift({ sender: 'Alice Smith', subject, category, message, date: new Date().toLocaleDateString(), status: 'Sent' });
    localStorage.setItem('rentmanager-tenant-messages', JSON.stringify(complaints));
    renderComplaints();
    event.target.reset();
    showTenantModal(`Your ${category.toLowerCase()} message was sent privately to the property team.`);
  });

  const renderComplaints = () => {
    const list = document.getElementById('complaint-list');
    const complaints = JSON.parse(localStorage.getItem('rentmanager-tenant-messages') || '[]');
    document.getElementById('complaint-count').textContent = `${complaints.length} ${complaints.length === 1 ? 'message' : 'messages'}`;
    list.innerHTML = complaints.length ? complaints.map(item => `
      <div class="rounded-xl border border-slate-200 p-4"><div class="flex items-start justify-between gap-3"><div><p class="font-semibold">${item.subject}</p><p class="mt-1 text-xs text-slate-500">${item.category} · ${item.date}</p></div><span class="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">${item.status}</span></div><p class="mt-3 text-sm leading-6 text-slate-600">${item.message}</p></div>`).join('') : '<div class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No private messages have been sent yet.</div>';
  };
  renderComplaints();

  const modal = document.getElementById('tenant-modal');
  const showTenantModal = message => {
    document.getElementById('tenant-modal-message').textContent = message;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };
  const closeTenantModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };
  document.getElementById('close-tenant-modal')?.addEventListener('click', closeTenantModal);
  document.getElementById('close-tenant-modal-action')?.addEventListener('click', closeTenantModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeTenantModal(); });

  const toast = document.getElementById('toast');
  const showToast = message => {
    toast.textContent = message;
    toast.classList.remove('translate-y-6', 'opacity-0', 'pointer-events-none');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.add('translate-y-6', 'opacity-0', 'pointer-events-none'), 3200);
  };
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.action)));
});
