const {
  zonedTimeToUtc,
  utcToZonedTime,
  format,
} = require('date-fns-tz');

export const getUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertTimezone = (date, timeZone) => {
  return utcToZonedTime(date, timeZone);
};
