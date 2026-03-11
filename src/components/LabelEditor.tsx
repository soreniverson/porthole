import { useState, useRef, useEffect } from "react";

interface LabelEditorProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export function LabelEditor({ value, onSave, onCancel }: LabelEditorProps) {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSave(text.trim());
        } else if (e.key === "Escape") {
          onCancel();
        }
      }}
      onBlur={() => onSave(text.trim())}
      className="bg-transparent border border-neutral-400 rounded px-1 text-xs w-full outline-none text-neutral-700 dark:text-neutral-300"
      placeholder="Add label..."
      maxLength={32}
    />
  );
}
