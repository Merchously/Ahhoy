"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minTime?: string;
  maxTime?: string;
  step?: number;
}

function generateTimeSlots(min: string, max: string, step: number): string[] {
  const slots: string[] = [];
  const [minH, minM] = min.split(":").map(Number);
  const [maxH, maxM] = max.split(":").map(Number);
  let totalMin = minH * 60 + minM;
  const endMin = maxH * 60 + maxM;

  while (totalMin <= endMin) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    totalMin += step;
  }
  return slots;
}

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function TimePicker({
  label,
  value,
  onChange,
  minTime = "06:00",
  maxTime = "23:00",
  step = 30,
}: TimePickerProps) {
  const slots = generateTimeSlots(minTime, maxTime, step);

  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-sm h-9">
          <SelectValue placeholder="Select time">
            {value ? formatTime12h(value) : "Select time"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {slots.map((slot) => (
            <SelectItem key={slot} value={slot}>
              {formatTime12h(slot)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
