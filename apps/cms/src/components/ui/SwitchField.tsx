"use client";

import { Switch } from "@heroui/react";

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function SwitchField({ label, checked, onChange }: SwitchFieldProps) {
  return (
    <Switch
      isSelected={checked}
      onChange={onChange}
      className="[--switch-control-bg-checked:var(--brand)] [--switch-control-bg-checked-hover:var(--brand)]"
    >
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <span className="text-sm text-gray-600">{label}</span>
      </Switch.Content>
    </Switch>
  );
}
