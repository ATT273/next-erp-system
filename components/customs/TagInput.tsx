"use client";
import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { TextField, Label, Input } from "@heroui/react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

const TagInput = ({
  value = [],
  onChange,
  placeholder = "Type and press Enter, Space or comma...",
  disabled = false,
  label,
}: TagInputProps) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      addTag(input);
      setInput("");
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const parts = pasted.split(/[\s,]+/).filter(Boolean);
    const newTags = parts.filter((p) => !value.includes(p));
    if (newTags.length > 0) onChange([...value, ...newTags]);
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <TextField
        isDisabled={disabled}
        value={input}
        onChange={setInput}
        className="w-full"
      >
        {label && <Label>{label}</Label>}
        <Input
          ref={inputRef}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => {
            if (input.trim()) {
              addTag(input);
              setInput("");
            }
          }}
        />
      </TextField>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-full bg-gray-900 text-white px-2.5 py-0.5 text-xs font-semibold"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-0.5 rounded-full hover:bg-white/20 p-0.5 leading-none"
                aria-label={`Remove ${tag}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
