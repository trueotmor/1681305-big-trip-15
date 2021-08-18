import dayjs from 'dayjs';
import Abstract from '../view/abstract';

const dateFormats = new Map([
  ['full', 'DD/MM/YY hh:mm'],
  ['common', 'YYYY-MM-DD'],
  ['short', 'MMM DD'],
  ['time', 'hh:mm'],
]);

export const renderPosition = {
  BEFOREEND: 'beforeend',
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
};

export const render = (container, element, place = renderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }
  switch (place) {
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
    case renderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case renderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case renderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

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

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const humanizeTaskDate = (taskDate, format = 'common') => {
  if (dateFormats.has(format)) {
    format = dateFormats.get(format);
  }
  return dayjs(taskDate).format(format);
};

export const dateDifference = (startDate, endDate, timeFormat) => dayjs(startDate).diff(endDate, timeFormat);

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }
  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Cant replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};
