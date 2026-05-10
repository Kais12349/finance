import { formatInTimeZone } from "date-fns-tz";

const pattern = "yyyy-MM-dd HH:mm:ss zzz";

export function buildTimeZones(date: Date) {
  return {
    beijingTime: formatInTimeZone(date, "Asia/Shanghai", pattern),
    newYorkTime: formatInTimeZone(date, "America/New_York", pattern),
    losAngelesTime: formatInTimeZone(date, "America/Los_Angeles", pattern),
    londonTime: formatInTimeZone(date, "Europe/London", pattern),
  };
}

export function displayDate(date: Date) {
  return formatInTimeZone(date, "Asia/Shanghai", "yyyy-MM-dd HH:mm");
}
