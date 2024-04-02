const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const { isSameDay, format } = require('date-fns');

export const getUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertTimezone = (date, timeZone) => {
  return utcToZonedTime(date, timeZone);
};

export const isEqualDay = (date1, date2) => {
  return isSameDay(date1, date2);
};

export const formatDate = date => {
  return format(date, '@MMMM d, yyyy');
};
