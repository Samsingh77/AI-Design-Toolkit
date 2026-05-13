@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  --color-brand: #3D1D41;
  --color-brand-secondary: #E30648;
  --color-brand-accent: #64748b;
  --color-brand-dark: #120214;
  --color-surface: #ffffff;
  --color-bg: #e2e8f0;
  --color-border: #cbd5e1;
  --color-toolbar: #f8fafc;
}

@theme {
  --color-canvas: #334155;
}

@layer base {
  body {
    @apply bg-bg text-slate-900 antialiased selection:bg-brand-secondary/30;
  }
}

@layer utilities {
  .glass {
    @apply bg-white/80 backdrop-blur-md border border-white/40;
  }
  .slick-card {
    @apply bg-white border border-border shadow-sm transition-all duration-300;
  }
  .slick-btn {
    @apply px-4 py-2 rounded-lg font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-[11px] uppercase tracking-wider;
  }
  .slick-btn-primary {
    @apply bg-brand-secondary text-white shadow-md shadow-brand-secondary/20 hover:bg-brand-secondary/90 hover:shadow-lg hover:-translate-y-0.5;
  }
  .slick-btn-brand {
    @apply bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand/90 hover:shadow-lg hover:-translate-y-0.5;
  }
  .pro-toolbar {
    @apply w-[42px] bg-[#333333] border-r border-[#1a1a1a] flex flex-col items-center py-4 gap-1 shrink-0 z-50 select-none;
  }
  .pro-toolbar-btn {
    @apply w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-100 relative cursor-default text-[#9c9c9c];
  }
  .pro-toolbar-btn.active {
    @apply bg-[#4d4d4d] text-white;
  }
  .pro-toolbar-btn:not(.active):hover {
    @apply bg-[#3d3d3d] text-gray-200;
  }
  .pro-menu-dropdown {
    @apply absolute top-full left-0 mt-0 bg-[#2b2b2b] border border-[#1a1a1a] shadow-2xl py-1 flex flex-col min-w-[220px] z-[200] select-none;
  }
  .pro-menu-item {
    @apply px-4 py-1.5 flex items-center justify-between text-[11px] text-[#cccccc] hover:bg-brand-secondary hover:text-white transition-colors cursor-default whitespace-nowrap gap-8;
  }
  .pro-menu-sep {
    @apply h-px bg-[#444444] my-1 mx-1;
  }
  .pro-menu-shortcut {
    @apply text-[9px] text-gray-500 font-mono group-hover:text-white/70;
  }
  .pro-toolbar-btn .flyout {
    @apply absolute left-full top-0 bg-[#2b2b2b] border border-[#1a1a1a] shadow-2xl py-1 hidden group-hover:flex flex-col min-w-[180px] z-[100];
  }
  /* Pseudo-element to bridge any gap and ensure hover stability */
  .pro-toolbar-btn .flyout::before {
    content: '';
    @apply absolute -left-4 top-0 bottom-0 w-4;
  }
  .flyout-item {
    @apply px-3 py-1.5 flex items-center justify-between text-[11px] text-[#cccccc] hover:bg-brand-secondary hover:text-white transition-colors cursor-default whitespace-nowrap gap-3;
  }
  .flyout-item.active {
    @apply text-white font-bold bg-[#4d4d4d];
  }
  .toolbar-sep {
    @apply w-6 h-px bg-[#444444] my-1;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

input[type="range"] {
  @apply h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-[#00BEC8] rounded-full border-2 border-white shadow-md transition-transform hover:scale-125 focus:ring-2 focus:ring-[#00BEC8]/50;
}
