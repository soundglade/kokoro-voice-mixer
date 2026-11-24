import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import {
  LANGUAGE_GROUPS,
  VOICES,
  inGroup,
  type LanguageGroup,
} from "./voices";

export function LanguageSelect({
  value,
  onChange,
}: {
  value: LanguageGroup;
  onChange: (group: LanguageGroup) => void;
}) {
  return (
    <SelectPrimitive.Root
      value={value.id}
      onValueChange={(id) =>
        onChange(LANGUAGE_GROUPS.find((group) => group.id === id)!)
      }
    >
      <SelectPrimitive.Trigger
        aria-label="Language"
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-background pr-3 pl-3.5 text-sm shadow-xs transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted"
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <ChevronDown className="size-4 text-muted-foreground" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-(--radix-select-content-available-height) min-w-48 overflow-hidden rounded-lg bg-background/80 p-1 text-foreground shadow-lg backdrop-blur-md"
        >
          <SelectPrimitive.Viewport>
            {LANGUAGE_GROUPS.map((group) => (
              <SelectPrimitive.Item
                key={group.id}
                value={group.id}
                className="flex cursor-default items-center gap-2 rounded-lg py-2 pr-3 pl-2 text-sm outline-none select-none data-[highlighted]:bg-muted"
              >
                <span className="flex size-4 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>
                  {group.name}
                </SelectPrimitive.ItemText>
                <span className="ml-auto pl-4 text-xs text-muted-foreground">
                  {voiceCount(group)}
                </span>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

function voiceCount(group: LanguageGroup) {
  const count = VOICES.filter((voice) => inGroup(voice, group)).length;
  return count === 1 ? "1 voice" : `${count} voices`;
}
