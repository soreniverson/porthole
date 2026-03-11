import { PortEntry } from "../lib/tauri";
import { PortRow } from "./PortRow";
import { EmptyState } from "./EmptyState";

interface PortListProps {
  ports: PortEntry[];
  showUnknownPorts: boolean;
  onRefresh: () => void;
  onError: (msg: string) => void;
}

export function PortList({
  ports,
  showUnknownPorts,
  onRefresh,
  onError,
}: PortListProps) {
  const filtered = showUnknownPorts
    ? ports
    : ports.filter((p) => p.stack !== "unknown");

  if (filtered.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="custom-scroll overflow-y-auto" style={{ maxHeight: 360 }}>
      {filtered.map((entry) => (
        <PortRow
          key={entry.port}
          entry={entry}
          onRefresh={onRefresh}
          onError={onError}
        />
      ))}
    </div>
  );
}
