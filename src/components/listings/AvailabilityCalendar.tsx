"use client";

import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { isBefore, startOfDay, parseISO, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";

const DAY_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

interface AvailabilityCalendarProps {
  availability: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    validFrom?: string | null;
    validUntil?: string | null;
  }[];
  blockedDates: { date: string }[];
  bookedDates: string[];
  // Single-day mode
  selectedDate?: Date | undefined;
  onDateSelect?: (date: Date | undefined) => void;
  // Multi-day (range) mode
  isMultiDay?: boolean;
  selectedRange?: { from: Date | undefined; to: Date | undefined };
  onRangeSelect?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  numberOfMonths?: 1 | 2;
  className?: string;
}

export function AvailabilityCalendar({
  availability,
  blockedDates,
  bookedDates,
  selectedDate,
  onDateSelect,
  isMultiDay = false,
  selectedRange,
  onRangeSelect,
  numberOfMonths = 1,
  className,
}: AvailabilityCalendarProps) {
  const today = startOfDay(new Date());

  const blockedSet = useMemo(() => {
    const set = new Set<string>();
    blockedDates.forEach((bd) => {
      const d = parseISO(bd.date.split("T")[0]);
      set.add(d.toDateString());
    });
    return set;
  }, [blockedDates]);

  const bookedSet = useMemo(() => {
    const set = new Set<string>();
    bookedDates.forEach((bd) => {
      const d = parseISO(bd.split("T")[0]);
      set.add(d.toDateString());
    });
    return set;
  }, [bookedDates]);

  const hasRules = availability.length > 0;

  const isDisabled = useMemo(() => {
    return (date: Date) => {
      // Past dates
      if (isBefore(date, today)) return true;

      // Blocked dates
      if (blockedSet.has(date.toDateString())) return true;

      // Booked dates
      if (bookedSet.has(date.toDateString())) return true;

      // Day-of-week availability (only check if rules exist)
      if (hasRules) {
        const dayNum = date.getDay();
        const available = availability.some((rule) => {
          if (DAY_MAP[rule.dayOfWeek] !== dayNum) return false;
          if (rule.validFrom && isBefore(date, parseISO(rule.validFrom))) return false;
          if (rule.validUntil && isBefore(parseISO(rule.validUntil), date)) return false;
          return true;
        });
        if (!available) return true;
      }

      return false;
    };
  }, [today, blockedSet, bookedSet, hasRules, availability]);

  // Modifiers for visual distinction
  const bookedModifier = useMemo(() => {
    return (date: Date) => bookedSet.has(date.toDateString());
  }, [bookedSet]);

  const blockedModifier = useMemo(() => {
    return (date: Date) => blockedSet.has(date.toDateString());
  }, [blockedSet]);

  const todayDate = new Date();

  const sharedProps = {
    disabled: isDisabled,
    modifiers: {
      booked: bookedModifier,
      blocked: blockedModifier,
      today: (date: Date) => isSameDay(date, todayDate),
    },
    modifiersClassNames: {
      booked: "!text-gray-400 !line-through",
      blocked: "!text-gray-300",
    },
    numberOfMonths,
    defaultMonth: todayDate,
    className: "rounded-xl",
  };

  function handleRangeSelect(range: DateRange | undefined) {
    onRangeSelect?.({
      from: range?.from,
      to: range?.to,
    });
  }

  return (
    <div className={className}>
      {isMultiDay ? (
        <Calendar
          mode="range"
          selected={
            selectedRange?.from
              ? { from: selectedRange.from, to: selectedRange.to ?? undefined }
              : undefined
          }
          onSelect={handleRangeSelect}
          {...sharedProps}
        />
      ) : (
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          {...sharedProps}
        />
      )}
      <div className="flex items-center gap-4 mt-3 px-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-white border border-gray-200" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
          Booked
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-50 border border-gray-200" />
          Not available
        </div>
      </div>
    </div>
  );
}
