const STEPS = [
  { label: 'Upload PDF' },
  { label: 'Signature' },
  { label: 'Position' },
  { label: 'Download' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center w-full max-w-xl mx-auto px-2" role="navigation" aria-label="Steps">
      {STEPS.map((step, index) => {
        const state =
          index < currentStep ? 'done' : index === currentStep ? 'active' : 'pending';

        return (
          <div key={index} className="flex items-center" style={{ flex: index < STEPS.length - 1 ? '1' : 'none' }}>
            {/* Dot + Label */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={`step-dot ${state}`} aria-current={state === 'active' ? 'step' : undefined}>
                {state === 'done' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                className={
                  state === 'active'
                    ? 'text-teal-400 font-semibold'
                    : state === 'done'
                    ? 'text-teal-500/70 font-medium'
                    : 'text-slate-500 font-medium'
                }
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div className="step-line mx-2 mb-5">
                <div
                  className="step-line-fill"
                  style={{ width: index < currentStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
