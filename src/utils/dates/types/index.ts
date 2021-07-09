import { subDays, startOfDay, endOfDay, parseISO, differenceInDays } from 'date-fns';
import { filter, isEmpty } from 'ramda';
import { formatInternational, isDateObject } from '../../helpers/date';

export interface DateRange {
  startDate?: Date | null;
  endDate?: Date | null;
}

export type DateInterval = 'today' | 'yesterday' | 'last7Days' | 'last30Days' | 'last90Days' | 'last180days' | 'last365Days';

export const dateRangeIsEmpty = (dateRange?: DateRange): boolean => dateRange === undefined
  || isEmpty(filter(Boolean, dateRange as any));

export const rangeIsInterval = (range?: DateRange | DateInterval): range is DateInterval => typeof range === 'string';

const INTERVAL_TO_STRING_MAP: Record<DateInterval, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  last90Days: 'Last 90 days',
  last180days: 'Last 180 days',
  last365Days: 'Last 365 days',
};

const INTERVAL_TO_DAYS_MAP: Record<DateInterval, number> = {
  today: 0,
  yesterday: 1,
  last7Days: 7,
  last30Days: 30,
  last90Days: 90,
  last180days: 180,
  last365Days: 365,
};

export const DATE_INTERVALS: DateInterval[] = Object.keys(INTERVAL_TO_STRING_MAP) as DateInterval[];

const dateRangeToString = (range?: DateRange): string | undefined => {
  if (!range || dateRangeIsEmpty(range)) {
    return undefined;
  }

  if (range.startDate && !range.endDate) {
    return `Since ${formatInternational(range.startDate)}`;
  }

  if (!range.startDate && range.endDate) {
    return `Until ${formatInternational(range.endDate)}`;
  }

  return `${formatInternational(range.startDate)} - ${formatInternational(range.endDate)}`;
};

export const rangeOrIntervalToString = (range?: DateRange | DateInterval): string | undefined => {
  if (!range) {
    return undefined;
  }

  if (!rangeIsInterval(range)) {
    return dateRangeToString(range);
  }

  return INTERVAL_TO_STRING_MAP[range];
};

const startOfDaysAgo = (daysAgo: number) => startOfDay(subDays(new Date(), daysAgo));

export const intervalToDateRange = (dateInterval?: DateInterval | DateRange): DateRange => {
  if (!dateInterval) {
    return {};
  }

  if (!rangeIsInterval(dateInterval)) {
    return dateInterval;
  }

  switch (dateInterval) {
    case 'today':
      return { startDate: startOfDay(new Date()), endDate: new Date() };
    case 'yesterday':
      return { startDate: startOfDaysAgo(1), endDate: endOfDay(subDays(new Date(), 1)) };
    case 'last7Days':
      return { startDate: startOfDaysAgo(7), endDate: new Date() };
    case 'last30Days':
      return { startDate: startOfDaysAgo(30), endDate: new Date() };
    case 'last90Days':
      return { startDate: startOfDaysAgo(90), endDate: new Date() };
    case 'last180days':
      return { startDate: startOfDaysAgo(180), endDate: new Date() };
    case 'last365Days':
      return { startDate: startOfDaysAgo(365), endDate: new Date() };
  }

  return {};
};

export const dateRangeOrIntervalForDate = (date: Date | string): DateRange | DateInterval => {
  const theDate = isDateObject(date) ? date : parseISO(date);
  const daysBack = (days: number) => subDays(new Date(), days);

  if (differenceInDays(daysBack(0), theDate) < 0) {
    return 'today';
  } else if (differenceInDays(daysBack(1), theDate) < 0) {
    return 'yesterday';
  } else if (differenceInDays(daysBack(7), theDate) < 0) {
    return 'last7Days';
  } else if (differenceInDays(daysBack(30), theDate) < 0) {
    return 'last30Days';
  } else if (differenceInDays(daysBack(90), theDate) < 0) {
    return 'last90Days';
  } else if (differenceInDays(daysBack(180), theDate) < 0) {
    return 'last180days';
  } else if (differenceInDays(daysBack(365), theDate) < 0) {
    return 'last365Days';
  }

  const interval = Object.entries(INTERVAL_TO_DAYS_MAP).find(
    (_, days: number) => differenceInDays(daysBack(days), theDate) < 0,
  ) as [DateInterval, number] | undefined;

  return interval?.[0] ?? { startDate: startOfDay(theDate) };
};
