registerView('insights', () => `
<div class="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <div class="inline-flex items-center gap-2 bg-secondary-container/20 px-3 py-1 rounded-full mb-4">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span class="text-secondary text-xs font-bold font-label uppercase tracking-widest">Live Engine Active</span>
      </div>
      <h2 class="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Diagnostic Ecosystem</h2>
      <p class="text-on-surface-variant mt-2 max-w-xl">Deep learning analysis — aggregated from last 24 diagnostic cycles.</p>
    </div>
    <div class="flex gap-4">
      <button class="bg-surface-container-highest text-primary px-6 py-3 rounded-md border border-outline-variant/15 flex items-center gap-2 text-sm font-semibold hover:bg-surface-bright transition-colors">
        <span class="material-symbols-outlined text-lg">download</span> Export Dataset
      </button>
      <button class="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-lg">refresh</span> Recalibrate Models
      </button>
    </div>
  </div>

  <!-- Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Anomaly Detection Chart -->
    <section class="md:col-span-8 bg-surface-container-high rounded-xl p-8 border border-outline-variant/5">
      <div class="flex justify-between items-start mb-8">
        <div>
          <p class="text-xs font-label uppercase font-bold text-cyan-400/70 mb-1">METRIC CLUSTER 01</p>
          <h3 class="text-2xl font-headline font-bold">Anomaly Detection Rate</h3>
        </div>
        <div class="text-right">
          <span class="text-4xl font-black font-headline text-primary tracking-tighter">98.4%</span>
          <p class="text-xs text-secondary font-medium">+1.2% from previous block</p>
        </div>
      </div>
      <div class="h-48 flex items-end justify-between gap-2 group">
        ${[40,65,55,85,96,75].map((h,i) => `
        <div class="w-full bg-surface-container-lowest rounded-t-lg relative" style="height:${h*2}px">
          <div class="absolute bottom-0 w-full rounded-t-lg group-hover:opacity-90 transition-all duration-700"
            style="height:${h}%;background:${h>=90?'linear-gradient(to top,#00c8e0,#00e5ff)':'linear-gradient(to top,rgba(0,229,255,0.2),rgba(0,229,255,0.05))'}"></div>
        </div>`).join('')}
      </div>
      <div class="flex justify-between mt-4 px-1">
        ${['Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i) => `
        <span class="text-xs ${i===4?'text-cyan-400 font-black':'text-slate-500 font-bold'} tracking-widest uppercase">${d}</span>`).join('')}
      </div>
    </section>

    <!-- Processing Time Gauge -->
    <section class="md:col-span-4 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/5">
      <div class="p-6 pb-2">
        <p class="text-xs font-label uppercase font-bold text-tertiary mb-1">ENGINE EFFICIENCY</p>
        <h3 class="text-xl font-headline font-bold">Processing Time</h3>
      </div>
      <div class="flex flex-col items-center p-6">
        <div class="relative w-36 h-36 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="72" cy="72" r="60" fill="transparent" stroke="#131b2e" stroke-width="8"/>
            <circle cx="72" cy="72" r="60" fill="transparent" stroke="#fec931" stroke-width="8" stroke-dasharray="377" stroke-dashoffset="94"/>
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-2xl font-black font-headline">1.2<span class="text-xs font-normal text-on-surface-variant">s</span></span>
            <span class="text-xs text-tertiary font-bold uppercase">per slice</span>
          </div>
        </div>
        <div class="mt-6 space-y-3 w-full">
          ${[['Voxel Mapping','0.4s',30,'bg-cyan-500'],['Neural Segmentation','0.8s',70,'bg-tertiary']].map(([k,v,p,c]) => `
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-on-surface-variant">${k}</span>
              <span class="font-semibold">${v}</span>
            </div>
            <div class="w-full h-1 bg-surface-container-lowest rounded-full overflow-hidden">
              <div class="${c} h-full progress-bar" style="width:${p}%"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- Footer Stats -->
    <section class="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
      ${[
        ['storage','Dataset Size','1.4 TB','text-slate-500'],
        ['psychology','Model Version','v2.8.4','text-cyan-500'],
        ['emergency','Critical Flags','08 Pending','text-tertiary'],
        ['group','Physician Reviews','124 Cycles','text-slate-500']
      ].map(([icon,label,val,c]) => `
      <div class="bg-surface-container p-6 rounded-lg">
        <span class="material-symbols-outlined ${c} text-xl mb-3 block">${icon}</span>
        <div class="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">${label}</div>
        <div class="text-xl font-bold font-headline">${val}</div>
      </div>`).join('')}
    </section>
  </div>
</div>
`);
