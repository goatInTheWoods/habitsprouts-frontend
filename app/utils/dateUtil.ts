const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const { isSameDay, format } = require('date-fns');

export const getUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertTimezone = (date: $TSFixMe, timeZone: $TSFixMe) => {
  return utcToZonedTime(date, timeZone);
};

export const isEqualDay = (date1: $TSFixMe, date2: $TSFixMe) => {
  return isSameDay(date1, date2);
};

export const formatDate = (date: $TSFixMe) => {
  return format(date, '@MMMM d, yyyy');
};
