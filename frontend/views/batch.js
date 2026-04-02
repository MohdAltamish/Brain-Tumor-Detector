registerView('batch', () => `
<div class="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
  <div class="flex justify-between items-end">
    <div>
      <span class="font-label text-xs font-medium uppercase tracking-widest text-slate-500">System Performance</span>
      <h2 class="text-3xl font-bold font-headline tracking-tight text-on-surface">Batch Auditor</h2>
    </div>
    <div class="text-right">
      <span class="block text-5xl font-extrabold text-primary-container font-headline">96%</span>
      <span class="text-xs font-bold text-cyan-400/60 uppercase tracking-widest">Accuracy</span>
    </div>
  </div>

  <!-- Performance Chart -->
  <div class="glass-panel rounded-xl p-6 relative overflow-hidden">
    <div class="absolute top-0 right-0 p-4 opacity-10">
      <span class="material-symbols-outlined text-7xl" style="font-variation-settings:'FILL' 1;">analytics</span>
    </div>
    <h3 class="text-xs font-headline font-bold uppercase tracking-widest text-cyan-400/70 mb-6">Batch 842-A Performance</h3>
    <div class="flex gap-2 items-end h-32 mb-4">
      ${[60,85,70,96,40,75,92,55,88,96].map((h,i) => `
      <div class="flex-1 rounded-t-sm transition-all hover:opacity-80" style="height:${h}%;background:${h>=90?'#00e5ff':h>=70?'rgba(0,229,255,0.4)':'#222a3d'}"></div>
      `).join('')}
    </div>
    <div class="grid grid-cols-3 gap-4 border-t border-outline-variant/10 pt-4">
      <div><span class="text-xs text-slate-500 uppercase font-semibold block">Processed</span><p class="text-xl font-bold font-headline">128</p></div>
      <div class="border-x border-white/5 px-4"><span class="text-xs text-slate-500 uppercase font-semibold block">Flagged</span><p class="text-xl font-bold font-headline text-tertiary">04</p></div>
      <div class="text-right"><span class="text-xs text-slate-500 uppercase font-semibold block">Latency</span><p class="text-xl font-bold font-headline">24ms</p></div>
    </div>
  </div>

  <!-- Upload New Batch -->
  <div class="flex items-center justify-between">
    <h3 class="font-label text-xs font-bold uppercase tracking-widest text-cyan-400/80">Scan Results</h3>
    <button class="bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
      <span class="material-symbols-outlined text-sm">upload</span> Upload Batch ZIP
    </button>
  </div>

  <!-- Scan Cards -->
  <div class="space-y-3">
    ${[
      {id:'#PX-9920',label:'GLIOMA',color:'text-error bg-error-container/20',pct:98},
      {id:'#PX-8152',label:'NORMAL',color:'text-secondary bg-secondary-container/20',pct:94},
      {id:'#PX-7421',label:'MENINGIOMA',color:'text-tertiary-fixed-dim bg-tertiary-container/10',pct:89},
      {id:'#PX-6623',label:'NORMAL',color:'text-secondary bg-secondary-container/20',pct:97},
      {id:'#PX-5512',label:'PITUITARY',color:'text-primary bg-primary/10',pct:91},
    ].map(s => `
    <div class="glass-card rounded-xl p-4 flex gap-4 items-center hover:bg-white/5 transition-all">
      <div class="w-16 h-16 rounded-lg bg-surface-container-lowest border border-white/5 flex items-center justify-center">
        <span class="material-symbols-outlined text-3xl text-cyan-900/50" style="font-variation-settings:'FILL' 1;">psychology</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start">
          <h4 class="font-headline font-bold text-on-surface">ID: ${s.id}</h4>
          <span class="text-xs font-bold ${s.color} px-2 py-0.5 rounded">${s.label}</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">Acquisition: Today</p>
        <div class="flex items-center gap-2 mt-2">
          <div class="h-1 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div class="h-full bg-primary-container progress-bar" style="width:${s.pct}%"></div>
          </div>
          <span class="text-xs font-medium text-primary-fixed-dim">${s.pct}% Match</span>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <!-- Confusion Matrix Summary -->
  <div class="glass-panel rounded-xl p-6">
    <h3 class="text-xs font-headline font-bold uppercase tracking-widest text-cyan-400/70 mb-4">Classification Distribution</h3>
    <div class="grid grid-cols-4 gap-3">
      ${[['Glioma','38','text-error'],['Meningioma','21','text-tertiary'],['Pituitary','29','text-primary'],['Normal','40','text-secondary']].map(([k,v,c]) => `
      <div class="bg-surface-container p-4 rounded-lg text-center">
        <span class="text-2xl font-black font-headline ${c}">${v}</span>
        <p class="text-xs text-slate-500 mt-1 uppercase font-bold">${k}</p>
      </div>`).join('')}
    </div>
  </div>
</div>
`);
