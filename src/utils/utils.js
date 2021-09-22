import dayjs from 'dayjs';

const dateFormats = new Map([
  ['full', 'DD/MM/YY hh:mm'],
  ['common', 'YYYY-MM-DDTHH:mm'],
  ['short', 'MMM DD'],
  ['time', 'HH:mm'],
]);

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRndArr = (anyItarable, maxLength, minLength) => {
  const clonedData = [...anyItarable];
  const result = [];

  if (maxLength === undefined) {
    maxLength = clonedData.length;
  }
  if (minLength === undefined) {
    minLength = 1;
  }
  if (maxLength > 1) {
    if (minLength < maxLength) {
      maxLength = getRandomInteger(minLength, maxLength);
    } else {
      maxLength = minLength;
    }
  }

  while (result.length < maxLength) {
    const elementRndIndex = getRandomInteger(0, clonedData.length - 1);
    const randomElement = clonedData[elementRndIndex];

    if (!result.includes(randomElement)) {
      result.push(randomElement);
    }
  }
  return result;
};

export const getRandomElement = (iterable) => {
  const clonedData = [...iterable];
  const randomIndex = Math.floor(Math.random() * clonedData.length);
  return clonedData[randomIndex];
};

export const humanizePointDate = (taskDate, format = 'common') => {
  if (dateFormats.has(format)) {
    format = dateFormats.get(format);
  }
  return dayjs(taskDate).format(format);
};

// Формат продолжительности нахождения в точке маршрута зависит от длительности:

// Менее часа: минуты (например, 23M);
// Менее суток: часы минуты (например, 02H 44M или 12H 00M, если минуты равны нулю);
// Более суток: дни часы минуты (например, 01D 02H 30M или 07D 00H 00M, если часы и/или минуты равны нулю).

export const getTripDurationFormat = (duration) => {
  const MINUTES_PER_HOUR = 60;
  const MINUTES_PER_DAY = 1440;

  if (duration >= MINUTES_PER_DAY) {
    return 'D[D] HH[H] mm[M]';
  } else if (duration >= MINUTES_PER_HOUR) {
    return 'H[H] mm[M]';
  } else {
    return 'mm[M]';
  }
};

export const dateDifference = (startDate, endDate) => dayjs(startDate).diff(endDate, 'm');

export const getUniqueItems = (items) => [...new Set(items)];

export const countMoneyOfPointsByType = (points, type) =>
  points.filter((point) => point.type === type).reduce((accumulator, point) => accumulator + point.basePrice, 0);

export const countPointsByType = (points, type) => points.filter((point) => point.type === type).length;

export const countTimeOfPointsByType = (points, type) =>
  points.filter((point) => point.type === type).reduce((sum, point) => sum + (point.dateTo - point.dateFrom), 0);
