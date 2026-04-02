registerView('patients', () => `
<div class="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h2 class="text-4xl font-headline font-extrabold tracking-tight text-primary-fixed">Clinical Repository</h2>
      <p class="text-on-surface-variant">Managing 1,248 active neurological profiles.</p>
    </div>
    <div class="flex items-center gap-4">
      <div class="relative">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input class="bg-surface-container-lowest border-none rounded-xl pl-12 pr-6 py-3 w-64 focus:ring-1 focus:ring-primary-fixed-dim text-sm font-label outline-none" placeholder="Search Patient ID or Name..." type="text"/>
      </div>
      <button class="bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
        <span class="material-symbols-outlined">person_add</span> New Record
      </button>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="glass-panel p-6 rounded-xl h-28 flex flex-col justify-between">
      <span class="text-on-surface-variant font-label text-xs uppercase tracking-widest">Active Scans</span>
      <div class="flex items-end justify-between">
        <span class="text-3xl font-headline font-bold text-primary">24</span>
        <span class="bg-secondary-container/20 text-secondary text-xs px-2 py-1 rounded flex items-center gap-1">
          <span class="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span> Processing
        </span>
      </div>
    </div>
    <div class="bg-surface-container-high p-6 rounded-xl h-28 flex flex-col justify-between">
      <span class="text-on-surface-variant font-label text-xs uppercase tracking-widest">Flagged Priority</span>
      <div class="flex items-end justify-between">
        <span class="text-3xl font-headline font-bold text-tertiary">08</span>
        <span class="material-symbols-outlined text-tertiary">warning</span>
      </div>
    </div>
    <div class="md:col-span-2 bg-surface-container-low p-6 rounded-xl h-28 flex items-center justify-between border-l-4 border-primary">
      <div>
        <span class="text-on-surface-variant font-label text-xs uppercase tracking-widest">System Health</span>
        <p class="text-sm text-on-surface mt-1">AI Inference Engine: <span class="text-primary">Optimized</span></p>
      </div>
      <div class="flex gap-1 items-end h-10">
        ${[40,80,60,100,70].map(h => `<div class="w-3 rounded-t-sm" style="height:${h}%;background:rgba(195,245,255,${h/100})"></div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-2xl">
    <div class="hidden md:grid grid-cols-12 px-8 py-5 border-b border-outline-variant/10 bg-surface-container-high/50 text-xs font-label uppercase tracking-widest text-outline">
      <div class="col-span-4">Patient Identity</div>
      <div class="col-span-2">ID Reference</div>
      <div class="col-span-2 text-center">Status</div>
      <div class="col-span-2 text-center">Last Scan</div>
      <div class="col-span-2 text-right">Actions</div>
    </div>
    <div class="divide-y divide-outline-variant/10">
      ${[
        {init:'JS',name:'Jonathan Sterling',age:'Adult Male, 42y',id:'#NS-8842-X',status:'Analyzed',statusColor:'text-secondary bg-secondary-container/20',statusDot:'bg-secondary',date:'Oct 24, 2023'},
        {init:'EC',name:'Elena Chambers',age:'Adult Female, 29y',id:'#NS-1205-A',status:'Flagged',statusColor:'text-error bg-error-container/20',statusDot:'bg-error',date:'Oct 26, 2023'},
        {init:'MW',name:'Marcus Wright',age:'Senior Male, 68y',id:'#NS-9021-Z',status:'Scan Pending',statusColor:'text-outline bg-surface-container-highest',statusDot:'bg-outline',date:'Scheduled'},
        {init:'AL',name:'Aria Lombardi',age:'Pediatric Female, 8y',id:'#NS-3341-P',status:'Analyzed',statusColor:'text-secondary bg-secondary-container/20',statusDot:'bg-secondary',date:'Oct 25, 2023'},
      ].map(p => `
      <div class="grid grid-cols-1 md:grid-cols-12 px-8 py-6 items-center hover:bg-surface-bright/50 transition-colors group gap-2 md:gap-0">
        <div class="col-span-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary font-headline font-bold border border-primary/20 flex-shrink-0">${p.init}</div>
          <div>
            <h4 class="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">${p.name}</h4>
            <p class="text-xs text-on-surface-variant">${p.age}</p>
          </div>
        </div>
        <div class="col-span-2 font-label text-sm text-on-surface-variant">${p.id}</div>
        <div class="col-span-2 flex md:justify-center">
          <span class="${p.statusColor} text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 ${p.statusDot} rounded-full"></span> ${p.status}
          </span>
        </div>
        <div class="col-span-2 md:text-center font-label text-sm text-on-surface-variant">${p.date}</div>
        <div class="col-span-2 md:text-right">
          <button onclick="navigate('pipeline')" class="text-primary text-xs font-bold font-label hover:underline underline-offset-4 flex items-center gap-1 md:ml-auto">
            View Results <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>`).join('')}
    </div>
    <div class="px-8 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/10">
      <span class="text-xs text-on-surface-variant font-label">Showing 4 of 1,248 records</span>
      <div class="flex items-center gap-2">
        ${['first_page','chevron_left','chevron_right','last_page'].map(icon => `
        <button class="p-2 hover:bg-surface-variant rounded-md text-outline">
          <span class="material-symbols-outlined text-lg">${icon}</span>
        </button>`).join('<span class="px-3 text-sm font-bold text-primary">1</span>').replace('<button','').replace('</button>','')}
        <button class="p-2 hover:bg-surface-variant rounded-md text-outline"><span class="material-symbols-outlined text-lg">first_page</span></button>
        <button class="p-2 hover:bg-surface-variant rounded-md text-outline"><span class="material-symbols-outlined text-lg">chevron_left</span></button>
        <span class="px-3 text-sm font-bold text-primary">1</span>
        <button class="p-2 hover:bg-surface-variant rounded-md text-outline"><span class="material-symbols-outlined text-lg">chevron_right</span></button>
        <button class="p-2 hover:bg-surface-variant rounded-md text-outline"><span class="material-symbols-outlined text-lg">last_page</span></button>
      </div>
    </div>
  </div>
</div>
`);
