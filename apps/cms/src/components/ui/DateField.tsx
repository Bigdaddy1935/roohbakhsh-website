"use client";

import { Calendar, DateField as HeroDateField, DatePicker } from "@heroui/react";
import { I18nProvider } from "react-aria-components";
import { parseDate, type CalendarDate, type DateValue } from "@internationalized/date";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

function toCalendarDate(value: string): CalendarDate | null {
  const iso = value?.slice(0, 10);
  if (!iso) return null;
  try {
    return parseDate(iso);
  } catch {
    return null;
  }
}

export default function DateField({ label, value, onChange, required }: DateFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </span>

      <I18nProvider locale="ar-SA-u-ca-islamic-umalqura">
        <DatePicker
          aria-label={label}
          value={toCalendarDate(value)}
          onChange={(v: DateValue | null) => onChange(v ? v.toString() : "")}
        >
        <HeroDateField.Group
          fullWidth
          className="rounded-md border border-gray-200 bg-white px-3 h-[48px] shadow-none focus-within:border-[var(--brand)] transition-colors"
        >
          <HeroDateField.Input>
            {(segment) => <HeroDateField.Segment segment={segment} />}
          </HeroDateField.Input>
          <HeroDateField.Suffix>
            <DatePicker.Trigger>
              <DatePicker.TriggerIndicator className="text-gray-400" />
            </DatePicker.Trigger>
          </HeroDateField.Suffix>
        </HeroDateField.Group>
        <DatePicker.Popover>
          <Calendar aria-label={label}>
            <Calendar.Header>
              <Calendar.YearPickerTrigger>
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>
              <Calendar.NavButton slot="previous" />
              <Calendar.NavButton slot="next" />
            </Calendar.Header>
            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
            </Calendar.Grid>
            <Calendar.YearPickerGrid>
              <Calendar.YearPickerGridBody>
                {({ year }) => <Calendar.YearPickerCell year={year} />}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>
        </DatePicker>
      </I18nProvider>
    </div>
  );
}
