import { Terminal } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-3">
        <Terminal className="w-5 h-5 text-neutral-400" />
      </div>
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        No active ports
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
        Ports will appear here when services start
      </p>
    </div>
  );
}
