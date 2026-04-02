registerView('pipeline', () => {
  const r = lastResult;
  const hasResult = r && r.images;

  const original = hasResult ? `<img src="data:image/png;base64,${r.images.original}" class="w-full h-full object-cover"/>` :
    `<div class="w-full h-full flex flex-col items-center justify-center gap-2 text-cyan-900/40">
       <span class="material-symbols-outlined text-6xl" style="font-variation-settings:'FILL' 1;">psychology</span>
       <span class="text-xs font-mono">AWAITING UPLOAD</span>
     </div>`;

  const attacked = hasResult ? `<img src="data:image/png;base64,${r.images.attacked}" class="w-full h-full object-cover"/>` :
    `<div class="w-full h-full flex items-center justify-center text-error/30">
       <span class="material-symbols-outlined text-6xl">blur_on</span>
     </div>`;

  const shielded = hasResult ? `<img src="data:image/png;base64,${r.images.shielded}" class="w-full h-full object-cover"/>` :
    `<div class="w-full h-full flex items-center justify-center text-cyan-900/30">
       <span class="material-symbols-outlined text-6xl" style="font-variation-settings:'FILL' 1;">verified</span>
     </div>`;

  const classes = ['Glioma','Meningioma','No Tumor','Pituitary'];
  const preds = hasResult ? r.predictions : { Glioma:0, Meningioma:0, 'No Tumor':0, Pituitary:0 };
  const topClass = hasResult ? r.predicted_class : '—';
  const topConf = hasResult ? (r.confidence * 100).toFixed(1) : '—';

  const alertColor = hasResult ? (r.alert_level === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-tertiary/10 border-tertiary/30 text-tertiary') : 'bg-surface-container border-outline-variant/10 text-on-surface-variant';

  return `
<div class="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
  <div class="flex items-center justify-between">
    <div>
      <span class="font-headline font-bold text-xs tracking-widest text-primary-fixed-dim uppercase">Diagnostic Workflow</span>
      <h2 class="font-headline font-extrabold text-3xl text-on-surface tracking-tight">Pipeline Analysis</h2>
      ${hasResult ? `<p class="text-on-surface-variant text-sm mt-1">File: <span class="font-mono text-primary">${r.filename || 'scan.png'}</span></p>` : ''}
    </div>
    ${!hasResult ? `<button onclick="navigate('dashboard')" class="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg active:scale-95 transition-all">
      <span class="material-symbols-outlined text-sm">upload_file</span> Upload Scan
    </button>` : ''}
  </div>

  ${hasResult ? `
  <!-- Status Banner -->
  <div class="flex items-center gap-3 p-4 rounded-xl border ${alertColor}">
    <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">${r.alert_level === 'success' ? 'check_circle' : 'warning'}</span>
    <p class="text-sm font-semibold">${r.status}</p>
  </div>` : `
  <div class="flex items-center gap-3 p-4 rounded-xl border bg-surface-container border-outline-variant/10 text-on-surface-variant">
    <span class="material-symbols-outlined">info</span>
    <p class="text-sm">No scan analyzed yet. Go to Dashboard to upload an MRI scan.</p>
  </div>`}

  <!-- 3-Panel Comparison -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="glass-panel rounded-xl overflow-hidden">
      <div class="p-3 bg-surface-container-high/50 flex justify-between items-center">
        <span class="font-headline text-xs font-bold tracking-widest text-on-surface-variant">ORIGINAL MRI</span>
        <span class="text-xs font-mono text-primary-fixed-dim">RAW_01</span>
      </div>
      <div class="aspect-square bg-surface-container-lowest overflow-hidden">${original}</div>
      <div class="p-3 text-xs text-slate-400 border-t border-outline-variant/10">Source: T2-Weighted Axial</div>
    </div>

    <div class="glass-panel rounded-xl overflow-hidden border border-error/10">
      <div class="p-3 bg-surface-container-high/50 flex justify-between items-center">
        <span class="font-headline text-xs font-bold tracking-widest text-error">ATTACKED MRI</span>
        <span class="text-xs font-mono text-error">OMNICHAOS</span>
      </div>
      <div class="aspect-square bg-surface-container-lowest overflow-hidden">${attacked}</div>
      <div class="p-3 text-xs text-error/60 border-t border-outline-variant/10">Status: Signal Corruption Simulated</div>
    </div>

    <div class="glass-panel rounded-xl overflow-hidden border border-primary-container/10">
      <div class="p-3 bg-surface-container-high/50 flex justify-between items-center">
        <span class="font-headline text-xs font-bold tracking-widest text-primary-container">SHIELDED MRI</span>
        <span class="text-xs font-mono text-primary-container">DENOISED</span>
      </div>
      <div class="aspect-square bg-surface-container-lowest overflow-hidden">${shielded}</div>
      <div class="p-3 text-xs text-primary-container border-t border-outline-variant/10">Process: Median + CLAHE Defense</div>
    </div>
  </div>

  <!-- Metrics Row -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Summary -->
    <div class="lg:col-span-8 glass-panel rounded-2xl p-6 space-y-6">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary-fixed-dim">psychology</span>
        <h3 class="font-headline text-lg font-bold">DIAGNOSIS SUMMARY</h3>
      </div>
      ${hasResult ? `
      <div class="flex items-center gap-6 p-6 bg-surface-container rounded-xl">
        <div class="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black font-headline bg-gradient-to-br from-primary/20 to-primary-container/20 border-2 border-primary/30 text-primary">${topConf}<span class="text-sm">%</span></div>
        <div>
          <p class="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">High Confidence Detection</p>
          <p class="text-3xl font-black font-headline text-on-surface">${topClass}</p>
          <p class="text-sm text-on-surface-variant mt-1">Model: v4_Unbeatable_Final | Shield: Active</p>
        </div>
      </div>` : `<div class="p-6 bg-surface-container rounded-xl text-center text-on-surface-variant">Upload a scan to see results here.</div>`}
      <p class="text-sm text-on-surface-variant leading-relaxed">
        The VisualHealer applied Median filtering and CLAHE enhancement to recover the MRI from adversarial noise. HybridChimeraAI then classified the restored scan using CNN + Transformer + MoE architecture.
      </p>
    </div>

    <!-- Classification Scores -->
    <div class="lg:col-span-4 glass-panel rounded-2xl p-6 space-y-5">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary-fixed-dim">analytics</span>
        <h3 class="font-headline text-lg font-bold">CLASSIFICATION</h3>
      </div>
      ${classes.map(cls => {
        const pct = hasResult ? (preds[cls] * 100).toFixed(1) : 0;
        const isTop = hasResult && cls === topClass;
        return `
        <div class="space-y-2">
          <div class="flex justify-between items-end">
            <span class="font-headline text-sm font-bold tracking-tight ${isTop ? 'text-on-surface' : 'text-slate-400'}">${cls.toUpperCase()}</span>
            <span class="${isTop ? 'text-lg font-black text-primary-container' : 'text-sm font-bold text-slate-400'}">${pct}%</span>
          </div>
          <div class="h-${isTop ? '2' : '1.5'} w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div class="h-full ${isTop ? 'bg-gradient-to-r from-primary to-primary-container shadow-[0_0_12px_rgba(0,229,255,0.4)]' : 'bg-slate-600'} progress-bar" style="width:${pct}%"></div>
          </div>
        </div>`;
      }).join('')}

      <div class="pt-4 border-t border-outline-variant/10 space-y-3">
        <div class="flex gap-2 items-start">
          <span class="material-symbols-outlined text-sm text-primary-container mt-0.5">verified</span>
          <p class="text-xs text-slate-400"><span class="text-on-surface font-semibold">Denoising:</span> Median Filter + CLAHE</p>
        </div>
        <div class="flex gap-2 items-start">
          <span class="material-symbols-outlined text-sm text-primary-container mt-0.5">shield</span>
          <p class="text-xs text-slate-400"><span class="text-on-surface font-semibold">Model:</span> MobileNetV2 Champion (96% accuracy)</p>
        </div>
      </div>
    </div>
  </div>

  ${hasResult ? `
  <div class="flex justify-center">
    <button onclick="navigate('dashboard')" class="flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-surface-bright transition-all">
      <span class="material-symbols-outlined">upload_file</span> Analyze Another Scan
    </button>
  </div>` : ''}
</div>
`;
});
