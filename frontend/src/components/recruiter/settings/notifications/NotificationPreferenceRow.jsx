import { Check } from 'lucide-react';

export default function NotificationPreferenceRow({ label, description, checked, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between pt-4 first:pt-1">
      <div className="space-y-0.5">
        <h3 className="text-xs font-black text-emerald-600">{label}</h3>
        <p className="text-xs font-medium text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`h-6 w-11 rounded-full transition-colors relative flex items-center px-0.5 ${
          disabled ? 'opacity-60 cursor-not-allowed bg-slate-300' : checked ? 'bg-indigo-600 cursor-pointer' : 'bg-slate-300 cursor-pointer'
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition-transform flex items-center justify-center text-indigo-600 shadow-xs ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {checked && <Check className="h-3 w-3 stroke-[3]" />}
        </span>
      </button>
    </div>
  );
}
