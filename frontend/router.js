// NeuroScan Router
const views = {};
const pageTitles = {
  dashboard: 'Dashboard',
  pipeline: 'Diagnostic Pipeline',
  sandbox: 'Chaos Sandbox',
  batch: 'Batch Auditor',
  insights: 'AI Insights',
  patients: 'Patient Records',
  audit: 'Audit Log',
  config: 'System Config',
};

function registerView(id, renderFn) {
  views[id] = renderFn;
}

function navigate(viewId) {
  const container = document.getElementById('view-container');
  if (!container || !views[viewId]) return;

  // Update content
  container.innerHTML = `<div class="view pb-24 md:pb-0">${views[viewId]()}</div>`;

  // Update page title
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = pageTitles[viewId] || 'NeuroScan';

  // Update sidebar active states
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewId);
  });
  document.querySelectorAll('.mob-nav').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewId);
  });

  // Run any post-render hooks (e.g. dashboardInit checks API health)
  setTimeout(() => { if (window[`${viewId}Init`]) window[`${viewId}Init`](); }, 50);

  // Scroll to top
  window.scrollTo(0, 0);
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('hidden');
}
