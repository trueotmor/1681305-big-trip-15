import dayjs from 'dayjs';
// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


export const getRndArr = (anyItarable, maxLength, minLength) => {
  const anyArray = [...anyItarable];
  const resultArray = [];

  if (maxLength === undefined) {
    maxLength = anyArray.length;
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

  while (resultArray.length < maxLength) {
    const elementRndIndex = getRandomInteger(0, anyArray.length -1);
    const randomElement = anyArray[elementRndIndex];

    if (!resultArray.includes(randomElement)) {
      resultArray.push(randomElement);
    }
  }
  return resultArray;
};

export const getRandomElement = (iterable) => {
  const arr = [...iterable];
  const randomIndex = Math.floor(Math.random()*arr.length);
  return arr[randomIndex];
};

export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const humanizeTaskDate = (taskDate, format) => dayjs(taskDate).format(format);
export const dateDifference = (startDate, endDate, timeFormat) => dayjs(startDate).diff(endDate, timeFormat);
