export const UI = {
  // Global Layout System
  PAGE_WRAPPER: "min-h-screen bg-slate-50",
  PAGE_CONTAINER: "max-w-7xl mx-auto px-6 py-6 space-y-6",
  
  // Card System
  CARD_BASE: "bg-white border border-slate-200 rounded-3xl shadow-sm p-8",
  CARD_FLEX: "flex flex-col justify-between",
  STAT_CARD: "h-[180px]",
  
  // Grid System
  GRID_STATS: "grid grid-cols-4 gap-5",
  GRID_MAIN: "grid grid-cols-12 gap-6",
  COL_MAIN: "col-span-12 lg:col-span-8",
  COL_SIDE: "col-span-12 lg:col-span-4",
  GRID_TWO_COL: "grid grid-cols-2 gap-6",
  GRID_THREE_COL: "grid grid-cols-3 gap-5",
  
  // Typography System
  TEXT_PAGE_TITLE: "text-4xl font-bold tracking-tight text-slate-900",
  TEXT_SECTION_TITLE: "text-lg font-semibold text-slate-900",
  TEXT_BODY: "text-sm text-slate-600",
  TEXT_LABEL: "text-xs uppercase tracking-wider text-slate-400 font-medium",
  
  // Button System
  BTN_PRIMARY: "h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2",
  BTN_SECONDARY: "h-11 px-5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2",
  BTN_DANGER: "text-red-500 hover:text-red-600 transition-colors text-sm font-medium",
  
  // Tag System
  TAG_MATCHED: "h-8 px-3 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 flex items-center justify-center",
  TAG_MISSING: "h-8 px-3 rounded-lg text-xs font-medium bg-red-50 text-red-600 flex items-center justify-center",
  
  // Form System
  FORM_GRID: "grid grid-cols-2 gap-5",
  INPUT_BASE: "h-11 rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-sm",
  TEXTAREA_BASE: "rounded-2xl border-slate-200 min-h-[140px] focus:ring-blue-500 focus:border-blue-500 text-sm",
  
  // Table System
  TABLE_WRAPPER: "overflow-hidden rounded-2xl border border-slate-200 bg-white",
  TABLE_ROW: "border-b border-slate-100 hover:bg-slate-50 transition-colors h-14 text-sm text-slate-600",
  TABLE_HEADER: "bg-slate-50/50 border-b border-slate-100 h-12 text-xs uppercase tracking-wider text-slate-400 font-bold",
  
  // Feedback System
  BOX_WARNING: "bg-amber-50 border border-amber-200 rounded-xl p-4",
  EMPTY_STATE: "flex flex-col items-center justify-center py-16 text-center space-y-4"
};
