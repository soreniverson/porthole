import { ArrowLeft } from "lucide-react";
import { AppSettings } from "../lib/tauri";

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (partial: Partial<AppSettings>) => void;
  onBack: () => void;
}

const THEME_OPTIONS: Array<{ label: string; value: AppSettings["theme"] }> = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${
        checked ? "bg-neutral-900 dark:bg-neutral-100" : "bg-neutral-300 dark:bg-neutral-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 shadow transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}

export function Settings({ settings, onUpdate, onBack }: SettingsProps) {
  return (
    <div className="p-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Show unknown ports
          </span>
          <Toggle
            checked={settings.showUnknownPorts}
            onChange={(v) => onUpdate({ showUnknownPorts: v })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-1.5">
            Theme
          </label>
          <div className="flex rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate({ theme: opt.value })}
                className={`flex-1 px-3 py-1.5 text-xs transition-colors ${
                  settings.theme === opt.value
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                    : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
