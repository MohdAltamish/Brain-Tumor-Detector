registerView('sandbox', () => `
<div class="p-6 md:p-10 max-w-7xl mx-auto">
  <div class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <h2 class="font-headline text-2xl font-extrabold text-on-surface tracking-tight">Chaos Sandbox</h2>
      <p class="text-on-surface-variant text-sm mt-1">Simulate adversarial perturbations against the AI pipeline.</p>
    </div>
    <div class="bg-secondary-container/20 text-secondary px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold tracking-widest uppercase border border-secondary-container/30">
      <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> Live Feed
    </div>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
    <!-- Viewer Area -->
    <div class="xl:col-span-8 flex flex-col gap-6">
      <div class="glass-panel rounded-2xl overflow-hidden aspect-video relative">
        <div class="w-full h-full bg-surface-container-lowest flex items-center justify-center relative">
          <div class="absolute inset-0" style="background: radial-gradient(circle at 50% 50%, rgba(0,218,243,0.1), transparent 70%)"></div>
          <span class="material-symbols-outlined text-9xl text-cyan-900/20" style="font-variation-settings:'FILL' 1;">psychology</span>
          <!-- Noise overlay active -->
          <div id="noise-overlay" class="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none" style="background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/><feColorMatrix type=\"saturate\" values=\"0\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.15\"/></svg>'); background-size: 200px;"></div>
        </div>

        <div class="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
          <div class="flex justify-between items-start">
            <div class="glass-panel p-3 rounded-lg">
              <span class="block text-xs text-primary-fixed-dim uppercase tracking-widest font-bold mb-1">Status</span>
              <span class="text-on-surface font-headline font-bold">SCAN_ID: 9942-X</span>
            </div>
            <div class="glass-panel p-4 rounded-xl border border-primary/20">
              <span class="block text-xs text-secondary uppercase tracking-widest font-bold mb-1">AI Classification</span>
              <div id="ai-result" class="text-primary font-headline font-black">GLIOMA: 94% CONF.</div>
            </div>
          </div>
          <div class="flex justify-center gap-4 pointer-events-auto">
            <div class="glass-panel px-6 py-3 rounded-full flex items-center gap-6">
              <button class="material-symbols-outlined text-on-surface hover:text-primary transition-colors">zoom_in</button>
              <button class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">contrast</button>
              <button class="material-symbols-outlined text-on-surface hover:text-primary transition-colors">layers</button>
              <button class="material-symbols-outlined text-on-surface hover:text-primary transition-colors">grid_on</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${[['Entropy','14.82 bits','text-on-surface'],['SNR Ratio','1.28 dB','text-on-surface'],['Voxel Jitter','High Alert','text-primary'],['Attack Latency','12ms','text-on-surface']].map(([k,v,c]) => `
        <div class="bg-surface-container-high p-4 rounded-xl border border-outline-variant/10">
          <span class="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-2">${k}</span>
          <div class="text-xl font-headline font-bold ${c}">${v}</div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Control Panel -->
    <div class="xl:col-span-4 flex flex-col gap-6">
      <div class="bg-surface-container-high p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-6">
        <div>
          <h3 class="font-headline text-lg font-bold text-primary-fixed flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">precision_manufacturing</span> 7-Layer Engine
          </h3>
          <p class="text-slate-500 text-xs mt-1">Calibrate perturbation intensity levels.</p>
        </div>

        <div class="space-y-5">
          ${[['Visual Warp','42','blur_on'],['Gaussian Noise','65','grain'],['K-Space Physics','15','waves'],['Pixel Jitter','80','motion_blur'],['Shadow Overlay','30','wb_sunny'],['Elastic Warp','50','deblur']].map(([label, val, icon]) => `
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <span class="material-symbols-outlined text-slate-500 text-sm">${icon}</span>${label}
              </label>
              <span class="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded" id="val-${label.replace(/ /g,'-')}">${val}%</span>
            </div>
            <input type="range" value="${val}" min="0" max="100"
              oninput="updateSlider(this, '${label.replace(/ /g,'-')}')"/>
          </div>`).join('')}

          <!-- K-Space Toggle -->
          <div class="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-slate-500">radio_button_checked</span>
              <span class="text-sm font-medium">K-Space Physics Attack</span>
            </div>
            <div class="w-11 h-6 bg-primary/20 rounded-full relative p-0.5 cursor-pointer" onclick="toggleKSpace(this)">
              <div class="w-4 h-4 bg-primary rounded-full ml-auto transition-all"></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
          <button onclick="resetEngine()" class="bg-surface-container-lowest text-primary text-xs font-bold uppercase tracking-widest py-3 rounded-xl border border-outline-variant/20 hover:bg-surface-bright transition-all">Reset Engine</button>
          <button onclick="executeAttack()" class="bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed text-xs font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 active:scale-95 transition-all">Execute Attack</button>
        </div>
      </div>

      <!-- Execution Log -->
      <div class="bg-surface-container-high p-5 rounded-2xl border border-outline-variant/10">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500">Execution Log</h4>
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        <div id="exec-log" class="space-y-2 font-mono text-xs text-slate-400 leading-relaxed max-h-40 overflow-y-auto">
          <div class="flex gap-2"><span class="text-primary-fixed-dim">[--:--:--]</span><span>Engine ready. No attacks active.</span></div>
        </div>
      </div>
    </div>
  </div>
</div>
`);

function updateSlider(el, id) {
  const display = document.getElementById(`val-${id}`);
  if (display) display.textContent = `${el.value}%`;
  updateNoise();
}

function updateNoise() {
  const overlay = document.getElementById('noise-overlay');
  if (overlay) overlay.style.opacity = '0.3';
}

function toggleKSpace(el) {
  el.classList.toggle('bg-primary/20');
  el.classList.toggle('bg-slate-700');
  const dot = el.querySelector('div');
  if (dot) {
    dot.classList.toggle('ml-auto');
    dot.classList.toggle('bg-primary');
    dot.classList.toggle('bg-slate-500');
  }
}

function resetEngine() {
  document.querySelectorAll('input[type=range]').forEach(r => { r.value = 0; });
  document.querySelectorAll('[id^="val-"]').forEach(el => { el.textContent = '0%'; });
  const overlay = document.getElementById('noise-overlay');
  if (overlay) overlay.style.opacity = '0';
  logEntry('Engine reset. All perturbation layers cleared.');
}

function executeAttack() {
  logEntry('Injecting Visual Warp layer...', 0);
  setTimeout(() => logEntry('K-Space frequency spike injected...'), 800);
  setTimeout(() => logEntry('WARNING: Signal degradation detected.', 0, true), 1600);
  setTimeout(() => logEntry('HybridChimeraAI reprocessing with defense pipeline...'), 2400);
  updateNoise();
  setTimeout(() => {
    const result = document.getElementById('ai-result');
    if (result) result.textContent = 'GLIOMA: 78% CONF. [DEGRADED]';
  }, 1600);
  setTimeout(() => {
    const result = document.getElementById('ai-result');
    if (result) result.textContent = 'GLIOMA: 96% CONF. [SHIELDED]';
    logEntry('Defense pipeline restored. Shield active.');
  }, 3500);
}

function logEntry(msg, delay = 0, warn = false) {
  setTimeout(() => {
    const log = document.getElementById('exec-log');
    if (!log) return;
    const t = new Date().toTimeString().slice(0,8);
    const div = document.createElement('div');
    div.className = `flex gap-2 ${warn ? 'text-tertiary' : ''}`;
    div.innerHTML = `<span class="text-primary-fixed-dim">[${t}]</span><span>${msg}</span>`;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }, delay);
}
