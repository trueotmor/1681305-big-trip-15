import dayjs from 'dayjs';
// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random


const dateFormats = new Map ([
  ['full', 'DD/MM/YY hh:mm'],
  ['common', 'YYYY-MM-DD'],
  ['short', 'MMM DD'],
  ['time', 'hh:mm'],
]);


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
    if (minLength < maxLength){
      maxLength = getRandomInteger(minLength, maxLength);
    } else {
      maxLength = minLength;
    }
  }

  while (result.length < maxLength) {
    const elementRndIndex = getRandomInteger(0, clonedData.length -1);
    const randomElement = clonedData[elementRndIndex];

    if (!result.includes(randomElement)) {
      result.push(randomElement);
    }
  }
  return result;
};

export const getRandomElement = (iterable) => {
  const clonedData = [...iterable];
  const randomIndex = Math.floor(Math.random()*clonedData.length);
  return clonedData[randomIndex];
};

export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const humanizeTaskDate = (taskDate, format = 'common') => {
  if (dateFormats.has(format)) {
    format = dateFormats.get(format);
  }
  return dayjs(taskDate).format(format);
};

export const dateDifference = (startDate, endDate, timeFormat) => dayjs(startDate).diff(endDate, timeFormat);
