import dayjs from 'dayjs';

const dateFormats = new Map([
  ['full', 'DD/MM/YY hh:mm'],
  ['common', 'YYYY-MM-DDTHH:mm'],
  ['short', 'MMM DD'],
  ['time', 'HH:mm'],
]);

export const humanizePointDate = (taskDate, format = 'common') => {
  if (dateFormats.has(format)) {
    format = dateFormats.get(format);
  }
  return dayjs(taskDate).format(format);
};

export const getTripDurationFormat = (duration, minutesPerDay, minutesPerHour) => {
  if (duration >= minutesPerDay) {
    return 'D[D] HH[H] mm[M]';
  } else if (duration >= minutesPerHour) {
    return 'H[H] mm[M]';
  }
  return 'mm[M]';
};

export const getDateDifference = (startDate, endDate) => dayjs(startDate).diff(endDate, 'm');

export const getUniqueItems = (items) => [...new Set(items)];

export const countMoneyOfPointsByType = (points, type) =>
  points.filter((point) => point.type === type).reduce((accumulator, point) => accumulator + point.basePrice, 0);

export const countPointsByType = (points, type) => points.filter((point) => point.type === type).length;

export const countTimeOfPointsByType = (points, type) =>
  points.filter((point) => point.type === type).reduce((sum, point) => sum + (point.dateTo - point.dateFrom), 0);
