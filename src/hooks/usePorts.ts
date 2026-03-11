import { useEffect, useState, useCallback } from "react";
import { listen } from "@tauri-apps/api/event";
import { PortEntry, getActivePorts } from "../lib/tauri";

export function usePorts() {
  const [ports, setPorts] = useState<PortEntry[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const refresh = useCallback(async () => {
    try {
      const result = await getActivePorts();
      setPorts(result);
      setLastRefreshed(new Date());
    } catch (e) {
      console.error("Failed to fetch ports:", e);
    }
  }, []);

  useEffect(() => {
    refresh();

    const unlisten = listen<PortEntry[]>("ports-updated", (event) => {
      setPorts(event.payload);
      setLastRefreshed(new Date());
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [refresh]);

  return { ports, lastRefreshed, refresh };
}
