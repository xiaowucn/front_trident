import dayjs from 'dayjs';

export function dateFormatter(datetime) {
  let parsedDatetime = dayjs.unix(datetime);
  if (parsedDatetime.isValid()) {
    return parsedDatetime.format('YYYY-MM-DD');
  }
  return datetime;
}

export function dateTimeFormatter(datetime) {
  let parsedDatetime = dayjs.unix(datetime);
  if (parsedDatetime.isValid()) {
    return parsedDatetime.format('YYYY-MM-DD HH:mm:ss');
  }
  return datetime;
}
