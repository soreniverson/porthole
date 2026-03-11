import { useState } from "react";
import { Globe, X } from "lucide-react";
import { PortEntry, killPort, setPortLabel, removePortLabel, openInBrowser } from "../lib/tauri";
import { StackIcon } from "./StackIcon";
import { LabelEditor } from "./LabelEditor";

interface PortRowProps {
  entry: PortEntry;
  onRefresh: () => void;
  onError: (msg: string) => void;
}

export function PortRow({ entry, onRefresh, onError }: PortRowProps) {
  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleKill = async () => {
    try {
      await killPort(entry.port);
      onRefresh();
    } catch (e) {
      onError(String(e));
    }
  };

  const handleOpen = async () => {
    try {
      await openInBrowser(entry.port);
    } catch (e) {
      onError(String(e));
    }
  };

  const handleSaveLabel = async (value: string) => {
    setEditing(false);
    try {
      if (value) {
        await setPortLabel(entry.port, value);
      } else {
        await removePortLabel(entry.port);
      }
      onRefresh();
    } catch (e) {
      onError(String(e));
    }
  };

  return (
    <div
      className="flex items-center h-12 px-3 gap-2.5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <StackIcon stack={entry.stack} />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold font-mono leading-tight">
          {entry.port}
        </div>
        {editing ? (
          <LabelEditor
            value={entry.label || ""}
            onSave={handleSaveLabel}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div
            className="text-xs text-neutral-400 truncate cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300 leading-tight"
            onClick={() => setEditing(true)}
          >
            {entry.label || entry.processName}
          </div>
        )}
      </div>

      {hovering && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleOpen}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            title="Open in browser"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleKill}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-neutral-400 hover:text-red-500 transition-colors"
            title="Kill process"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
