import { useState, useEffect, useCallback } from "react";
import { Settings as SettingsIcon, RefreshCw } from "lucide-react";
import { usePorts } from "./hooks/usePorts";
import { useSettings } from "./hooks/useSettings";
import { PortList } from "./components/PortList";
import { Settings } from "./components/Settings";

function App() {
  const { ports, lastRefreshed, refresh } = usePorts();
  const { settings, updateSettings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      // System
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", dark);
    }
  }, [settings.theme]);

  const showError = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const activePorts = settings.showUnknownPorts
    ? ports
    : ports.filter((p) => p.stack !== "unknown");

  const timeStr = lastRefreshed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="w-[320px] max-h-[480px] bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
        <span className="text-sm font-semibold tracking-tight">Porthole</span>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              activePorts.length > 0 ? "bg-green-400" : "bg-neutral-300 dark:bg-neutral-600"
            }`}
          />
          {activePorts.length} active
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {showSettings ? (
          <Settings
            settings={settings}
            onUpdate={updateSettings}
            onBack={() => setShowSettings(false)}
          />
        ) : (
          <PortList
            ports={ports}
            showUnknownPorts={settings.showUnknownPorts}
            onRefresh={refresh}
            onError={showError}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-400">{timeStr}</span>
          <button
            onClick={refresh}
            className="p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded transition-colors"
          title="Settings"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-12 left-3 right-3 bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
