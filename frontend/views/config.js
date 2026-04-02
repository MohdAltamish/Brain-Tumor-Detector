registerView('config', () => `
<div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h3 class="text-3xl font-extrabold font-headline text-on-surface tracking-tight uppercase">System Configuration</h3>
      <p class="text-on-surface-variant text-sm leading-relaxed max-w-2xl">Adjust core neural engine parameters and hardware orchestration for the NeuroScan L40 Diagnostic Array.</p>
    </div>
    <div class="flex gap-3">
      <button class="px-5 py-2.5 rounded-md border border-outline-variant/30 text-primary font-headline text-sm hover:bg-white/5 transition-all">Revert to Defaults</button>
      <button class="px-6 py-2.5 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-headline font-bold text-sm shadow-lg active:scale-95 transition-transform">Commit Changes</button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Left -->
    <div class="lg:col-span-8 space-y-8">
      <!-- Neural Engine Controls -->
      <div class="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <span class="material-symbols-outlined text-8xl" style="font-variation-settings:'FILL' 1;">psychology</span>
        </div>
        <h4 class="text-xs font-headline font-bold uppercase tracking-widest text-cyan-400 mb-8 flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span> Neural Core Optimization
        </h4>
        <div class="space-y-8">
          <div>
            <div class="flex justify-between items-center mb-3">
              <label class="font-headline text-sm font-semibold text-on-surface">AI Sensitivity Profile</label>
              <span class="px-2 py-0.5 bg-secondary-container/20 text-secondary text-xs rounded border border-secondary/20">BALANCED</span>
            </div>
            <div class="relative w-full h-2 bg-surface-container-lowest rounded-full">
              <div class="absolute top-0 left-0 h-full w-[65%] bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full"></div>
              <div class="absolute top-1/2 left-[65%] -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg border-4 border-surface-container-low cursor-pointer"></div>
            </div>
            <div class="flex justify-between text-xs text-slate-500 font-mono mt-2">
              <span>LATENCY_MIN</span><span>ACCURACY_MAX</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${[['Neural CPU','4.2 GHz','85','bg-cyan-400'],['VRAM / GPU','24 GB','92','bg-primary-container'],['Shared Memory','128 GB','40','bg-cyan-700']].map(([k,v,p,c]) => `
            <div class="bg-surface-container p-5 rounded-lg border border-outline-variant/10">
              <div class="flex justify-between items-start mb-3">
                <span class="text-xs font-headline text-slate-400 uppercase tracking-wider">${k}</span>
                <span class="text-cyan-400 font-mono text-sm">${v}</span>
              </div>
              <div class="text-2xl font-bold font-headline mb-3">${p}%</div>
              <div class="h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                <div class="h-full ${c} progress-bar" style="width:${p}%"></div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Operational Protocols -->
      <div class="bg-surface-container-low p-8 rounded-xl">
        <h4 class="text-xs font-headline font-bold uppercase tracking-widest text-cyan-400 mb-8 flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span> Operational Protocols
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${[
            ['Cloud Sync Architecture','Real-time offsite redundancy for pathology data.',true],
            ['Emergency Diagnostic Mode','Bypass non-critical checks during trauma triage.',false],
            ['Holographic Output','Enable 3D volumetric rendering on workstation hub.',true],
            ['Audit Transparency','Record all AI decision pathways for peer review.',true],
          ].map(([title,desc,on]) => `
          <div class="flex items-center justify-between">
            <div>
              <h5 class="text-sm font-bold font-headline text-on-surface">${title}</h5>
              <p class="text-xs text-slate-500 mt-1">${desc}</p>
            </div>
            <div class="w-11 h-6 ${on?'bg-cyan-400':'bg-surface-container-highest'} rounded-full relative flex items-center px-1 cursor-pointer flex-shrink-0 ml-4" onclick="this.classList.toggle('bg-cyan-400');this.classList.toggle('bg-surface-container-highest');this.querySelector('div').classList.toggle('ml-auto');">
              <div class="w-4 h-4 ${on?'bg-white ml-auto':'bg-slate-400'} rounded-full transition-all shadow-sm"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Right -->
    <div class="lg:col-span-4 space-y-8">
      <!-- System Status -->
      <div class="glass-panel p-6 rounded-xl">
        <h4 class="text-xs font-headline font-bold uppercase tracking-widest text-on-surface mb-6">Real-time Status</h4>
        <div class="aspect-square w-full bg-surface-container-lowest rounded-lg border border-outline-variant/10 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0" style="background:radial-gradient(circle at 50% 50%, rgba(0,218,243,0.15), transparent 70%)"></div>
          <div class="z-10 flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-cyan-400 text-5xl animate-pulse" style="font-variation-settings:'FILL' 1;">neurology</span>
            <span class="text-xs font-mono text-cyan-400/80">RENDERING_READY</span>
          </div>
        </div>
        <div class="mt-6 space-y-3">
          ${[['Core Temperature','38.4°C','text-tertiary'],['Network Latency','0.4ms','text-primary-fixed-dim'],['Last Sync','2m 45s ago','text-on-surface']].map(([k,v,c]) => `
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">${k}</span>
            <span class="${c}">${v}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Warning Card -->
      <div class="bg-tertiary/5 border border-tertiary/20 p-6 rounded-xl">
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-tertiary">warning</span>
          <div>
            <h5 class="text-sm font-bold font-headline text-tertiary">High Resource Load</h5>
            <p class="text-xs text-tertiary/70 mt-1 leading-relaxed">System allocation exceeds 80%. Increasing AI sensitivity may result in thermal throttling.</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-surface-container-low rounded-xl overflow-hidden">
        <h4 class="text-xs font-headline font-bold uppercase tracking-widest text-slate-400 p-6 pb-0">Maintenance Tools</h4>
        <div class="mt-4">
          ${[['restart_alt','Reboot Neural Core'],['cleaning_services','Flush Insight Cache'],['download','Export Config Log']].map(([icon,label]) => `
          <button class="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group border-t border-outline-variant/10 first:border-t-0">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-slate-500 group-hover:text-cyan-400 transition-colors">${icon}</span>
              <span class="text-xs font-medium">${label}</span>
            </div>
            <span class="material-symbols-outlined text-slate-700 text-sm">chevron_right</span>
          </button>`).join('')}
        </div>
      </div>
    </div>
  </div>
</div>
`);
