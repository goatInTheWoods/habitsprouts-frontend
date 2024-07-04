const { isSameDay, format } = require('date-fns');

export const getUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const isEqualDay = (date1: Date, date2: Date) => {
  return isSameDay(date1, date2);
};

export const formatLogDate = (date: Date) => {
  return format(date, '@MMMM d, yyyy');
};
