// Production API on Hugging Face Spaces
// Local dev: change to 'http://localhost:5050/api'
const API_BASE = 'https://mohdaltamish-neuroscan-api.hf.space/api';
let lastResult = null; // shared between views

registerView('dashboard', () => `
<div class="p-6 md:p-12 max-w-5xl mx-auto space-y-8">
  <section class="space-y-2">
    <h2 class="font-headline text-3xl font-extrabold text-primary tracking-tight">Main Workstation</h2>
    <p class="text-on-surface-variant">Upload an MRI scan to begin adversarial-robust AI diagnosis.</p>
  </section>

  <!-- Status Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 flex items-center justify-between">
      <div>
        <span class="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Engine Status</span>
        <h3 class="font-headline text-lg font-bold text-on-surface mt-1">Hybrid AI Core: Active</h3>
      </div>
      <div class="relative flex items-center justify-center w-12 h-12">
        <div class="absolute inset-0 bg-secondary/20 rounded-full animate-pulse"></div>
        <span class="material-symbols-outlined text-secondary" style="font-variation-settings:'FILL' 1;">neurology</span>
      </div>
    </div>
    <div id="api-status-card" class="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 flex items-center justify-between">
      <div>
        <span class="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">API Status</span>
        <h3 id="api-status-text" class="font-headline text-lg font-bold text-on-surface mt-1">Checking server...</h3>
      </div>
      <div id="api-status-icon" class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
        <span class="material-symbols-outlined text-primary animate-pulse">sync</span>
      </div>
    </div>
  </div>

  <!-- Upload Zone -->
  <section id="upload-zone" class="glass-card upload-zone rounded-2xl p-12 text-center relative overflow-hidden cursor-pointer"
    ondragover="event.preventDefault(); this.classList.add('dragover')"
    ondragleave="this.classList.remove('dragover')"
    ondrop="handleDrop(event)"
    onclick="document.getElementById('file-input').click()">
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/5 rounded-full blur-[100px]"></div>
    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-container/5 rounded-full blur-[100px]"></div>
    <div class="flex flex-col items-center gap-6 relative z-10">
      <div id="upload-icon-wrap" class="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.2)] transition-transform hover:scale-110">
        <span class="material-symbols-outlined text-on-primary-fixed text-4xl" style="font-variation-settings:'FILL' 1;">upload_file</span>
      </div>
      <div>
        <h3 class="font-headline text-2xl font-extrabold text-on-surface">Drag &amp; Drop MRI Scan</h3>
        <p class="text-on-surface-variant mt-2 max-w-md mx-auto">Supports PNG, JPEG, BMP. The AI pipeline will run attack simulation + defense + classification.</p>
      </div>
      <input id="file-input" type="file" accept=".png,.jpg,.jpeg,.bmp,.dcm" class="hidden" onchange="handleFileSelect(event)"/>
      <button class="bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-bold py-3 px-8 rounded-lg shadow-lg active:scale-95 transition-all">Browse Files</button>
    </div>
  </section>

  <!-- Uploading / Analyzing progress (hidden by default) -->
  <div id="progress-section" class="hidden glass-panel rounded-2xl p-8 space-y-4">
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
      <div>
        <p class="font-headline font-bold text-on-surface" id="progress-title">Analyzing MRI scan...</p>
        <p class="text-sm text-on-surface-variant" id="progress-sub">Running OmniChaos Attack + Shield + HybridChimeraAI</p>
      </div>
    </div>
    <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
      <div id="progress-bar-fill" class="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000" style="width:0%"></div>
    </div>
  </div>

  <!-- Info Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-tertiary-fixed-dim">history</span>
        <span class="font-label text-xs uppercase font-bold text-on-surface-variant tracking-wider">Recent Activity</span>
      </div>
      <div id="recent-list" class="space-y-3 text-sm">
        <div class="flex justify-between border-b border-outline-variant/10 pb-2"><span>No scans yet</span><span class="text-on-surface-variant text-xs">—</span></div>
      </div>
    </div>
    <div class="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-primary-fixed-dim">analytics</span>
        <span class="font-label text-xs uppercase font-bold text-on-surface-variant tracking-wider">Processing Queue</span>
      </div>
      <div class="flex items-end gap-2">
        <span id="queue-count" class="text-4xl font-headline font-bold text-primary">0</span>
        <span class="text-on-surface-variant text-sm mb-1">scans waiting</span>
      </div>
    </div>
    <div class="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-secondary">memory</span>
        <span class="font-label text-xs uppercase font-bold text-on-surface-variant tracking-wider">Total Sessions</span>
      </div>
      <div class="flex items-end gap-2">
        <span id="session-count" class="text-4xl font-headline font-bold text-secondary">0</span>
        <span class="text-on-surface-variant text-sm mb-1">analyzed</span>
      </div>
    </div>
  </div>
</div>
`);

// State
let sessionCount = 0;
const recentScans = [];

function dashboardInit() {
  checkAPIHealth();
}

async function checkAPIHealth() {
  const textEl = document.getElementById('api-status-text');
  const iconEl = document.getElementById('api-status-icon');
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    if (textEl) textEl.textContent = 'Backend: Connected';
    if (iconEl) iconEl.innerHTML = '<span class="material-symbols-outlined text-green-400" style="font-variation-settings:\'FILL\' 1;">check_circle</span>';
  } catch {
    if (textEl) textEl.textContent = 'Backend: Offline — start api.py';
    if (iconEl) iconEl.innerHTML = '<span class="material-symbols-outlined text-error" style="font-variation-settings:\'FILL\' 1;">error</span>';
  }
}

function handleDrop(event) {
  event.preventDefault();
  document.getElementById('upload-zone')?.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file) processUpload(file);
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) processUpload(file);
}

async function processUpload(file) {
  // Show progress
  document.getElementById('upload-zone')?.classList.add('hidden');
  const prog = document.getElementById('progress-section');
  if (prog) prog.classList.remove('hidden');

  // Animate progress bar stages
  animateProgress(['Uploading scan...','Running OmniChaos 7-Layer Attack...','Applying VisualHealer + FourierHealer...','Running HybridChimeraAI inference...','Compiling results...']);

  // Increment queue
  document.getElementById('queue-count').textContent = '1';

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_BASE}/analyze`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    lastResult = await res.json();
    lastResult.filename = file.name;

    // Update stats
    sessionCount++;
    document.getElementById('session-count').textContent = sessionCount;
    document.getElementById('queue-count').textContent = '0';

    // Add to recent
    recentScans.unshift({ name: file.name, result: lastResult.predicted_class, time: 'just now' });
    if (recentScans.length > 3) recentScans.pop();
    const recentEl = document.getElementById('recent-list');
    if (recentEl) {
      recentEl.innerHTML = recentScans.map(s => `
        <div class="flex justify-between border-b border-outline-variant/10 pb-2">
          <span class="truncate max-w-[120px]" title="${s.name}">${s.name}</span>
          <span class="text-on-surface-variant text-xs">${s.time}</span>
        </div>`).join('');
    }

    // Navigate to pipeline
    navigate('pipeline');

  } catch(err) {
    if (prog) prog.classList.add('hidden');
    document.getElementById('upload-zone')?.classList.remove('hidden');
    document.getElementById('queue-count').textContent = '0';
    alert(`⚠️ Could not connect to the NeuroScan API.\n\nMake sure the backend is running:\n  python api.py\n\nError: ${err.message}`);
  }
}

function animateProgress(stages) {
  const bar = document.getElementById('progress-bar-fill');
  const title = document.getElementById('progress-title');
  const sub = document.getElementById('progress-sub');
  stages.forEach((s, i) => {
    setTimeout(() => {
      if (bar) bar.style.width = `${((i + 1) / stages.length) * 100}%`;
      if (title) title.textContent = s;
    }, i * 900);
  });
}
