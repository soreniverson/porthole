import { useEffect, useState, useCallback } from "react";
import { AppSettings, getSettings, saveSettings } from "../lib/tauri";

const defaultSettings: AppSettings = {
  pollIntervalMs: 5000,
  launchAtLogin: false,
  showUnknownPorts: true,
  confirmBeforeKill: true,
  theme: "system",
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => setSettings(defaultSettings));
  }, []);

  const updateSettings = useCallback(
    async (partial: Partial<AppSettings>) => {
      const updated = { ...settings, ...partial };
      setSettings(updated);
      try {
        await saveSettings(updated);
      } catch (e) {
        console.error("Failed to save settings:", e);
      }
    },
    [settings]
  );

  return { settings, updateSettings };
}
