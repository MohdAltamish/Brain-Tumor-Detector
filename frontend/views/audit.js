registerView('audit', () => `
<div class="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
  <div class="flex items-end justify-between">
    <div>
      <h2 class="text-3xl font-headline font-bold text-on-surface tracking-tight">System Audit Log</h2>
      <p class="text-on-surface-variant text-sm mt-1">Immutable ledger of all system interactions and clinical processing events.</p>
    </div>
    <div class="flex gap-4">
      <button class="bg-surface-container-highest px-4 py-2 rounded-lg text-sm font-label flex items-center gap-2 hover:bg-surface-bright transition-colors">
        <span class="material-symbols-outlined text-sm">filter_list</span> Filter
      </button>
      <button class="bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">download</span> Export CSV
      </button>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
    ${[['Total Events','14,208','text-primary'],['Active Sessions','12','text-tertiary'],['Overrides','4','text-error'],['Uptime','99.98%','text-secondary']].map(([k,v,c]) => `
    <div class="bg-surface-container-high rounded-xl p-6 border border-outline-variant/5">
      <p class="text-xs ${c} tracking-widest uppercase mb-1">${k}</p>
      <p class="text-2xl font-headline font-bold">${v}</p>
    </div>`).join('')}
  </div>

  <!-- Log Table -->
  <div class="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
    <div class="hidden md:flex items-center px-6 py-5 border-b border-outline-variant/5 bg-surface-container-highest/30 text-xs font-bold text-slate-500 uppercase tracking-widest">
      <div class="w-1/4">Timestamp</div>
      <div class="w-1/4">Event Type</div>
      <div class="w-1/3">User / Resource</div>
      <div class="flex-1 text-right">Integrity Hash</div>
    </div>
    <div class="divide-y divide-outline-variant/5">
      ${[
        {ts:'2023-11-24 14:22:01',icon:'login',type:'User Login',user:'Dr. Elena Rodriguez',sub:'Station-04 [192.168.1.104]',hash:'8c4f...2e91',warn:false},
        {ts:'2023-11-24 14:18:55',icon:'warning',type:'Parameter Override',user:'Diagnostic AI Subsystem',sub:'Warning: Manual Noise Threshold Adjusted',hash:'a92d...44fb',warn:true},
        {ts:'2023-11-24 14:15:30',icon:'memory',type:'Scan Processed',user:'Patient #RU-98221 (fMRI)',sub:'Processing Node Alpha-9',hash:'33e1...ff02',warn:false},
        {ts:'2023-11-24 14:12:12',icon:'sync',type:'Database Sync',user:'Global Clinical Repository',sub:'Sync Status: Verified (422 Records)',hash:'6f5b...99ca',warn:false},
        {ts:'2023-11-24 14:05:44',icon:'logout',type:'User Logout',user:'Tech. Marcus Vane',sub:'Station-02 [192.168.1.102]',hash:'d112...cc31',warn:false},
      ].map(e => `
      <div class="flex flex-col md:flex-row md:items-center px-6 py-5 ${e.warn?'bg-error-container/5 hover:bg-error-container/10':'hover:bg-surface-bright/20'} transition-colors gap-2 md:gap-0">
        <div class="w-full md:w-1/4">
          <p class="text-xs font-mono text-cyan-400/80">${e.ts}</p>
        </div>
        <div class="w-full md:w-1/4">
          <span class="inline-flex items-center gap-2 text-sm font-semibold ${e.warn?'text-error':''}">
            <span class="material-symbols-outlined ${e.warn?'text-error':'text-primary-fixed-dim'} text-lg" ${e.warn?"style=\"font-variation-settings:'FILL' 1;\"":""}>${e.icon}</span>
            ${e.type}
          </span>
        </div>
        <div class="w-full md:w-1/3">
          <p class="text-sm font-medium">${e.user}</p>
          <p class="text-xs ${e.warn?'text-error/80':'text-slate-500'} uppercase">${e.sub}</p>
        </div>
        <div class="flex-1 md:text-right">
          <span class="text-xs font-mono text-slate-600">${e.hash}</span>
        </div>
      </div>`).join('')}
    </div>
  </div>
  <div class="flex justify-center">
    <button class="bg-surface-container-highest px-6 py-3 rounded-xl text-sm font-headline font-bold text-primary-fixed-dim border border-primary/10 hover:bg-surface-bright transition-all">
      Load Previous Event Records
    </button>
  </div>
</div>
`);
