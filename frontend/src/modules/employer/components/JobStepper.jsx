/**
 * JobStepper — industry-standard 4-step progress indicator.
 * Visuals: Completed (tick), Active (blue), Upcoming (grey).
 */
export default function JobStepper({ steps, currentStep }) {
  return (
    <nav aria-label="Progress" className="flex items-center gap-0 mt-6 select-none">
      {steps.map((label, i) => {
        const completed = i < currentStep;
        const active    = i === currentStep;

        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2.5">
              {/* Status Indicator */}
              <div
                className={`flex items-center justify-center text-[11px] font-bold transition-all shrink-0 ${
                  completed
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : active
                    ? 'bg-white text-[#2563eb] border-[#2563eb] shadow-sm'
                    : 'bg-white text-slate-300 border-slate-200'
                }`}
                style={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  borderWidth: active ? '2px' : '1px',
                }}
              >
                {completed ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  i + 1
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[13px] whitespace-nowrap transition-colors ${
                  completed
                    ? 'text-slate-400 font-medium'
                    : active
                    ? 'text-[#2563eb] font-bold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector Line */}
            {i < steps.length - 1 && (
              <div
                className="mx-4 shrink-0"
                style={{
                  width: 40,
                  height: 1,
                  background: i < currentStep ? '#e5e7eb' : '#f1f5f9',
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}



