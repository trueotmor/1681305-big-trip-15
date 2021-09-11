import dayjs from 'dayjs';
import { getRandomElement } from '../utils.js';
import { getRndArr } from '../utils.js';
import { getRandomInteger } from '../utils.js';

const DEFAULT_DURATION = 100;

const MIN_PHOTOS_COUNT = 1;
const MAX_PHOTOS_COUNT = 5;

const MIN_ABOUT_LENGTH = 1;
const MAX_ABOUT_LENGTH = 5;

const MIN_OFFER_PRICE = 10;
const MAX_OFFER_PRICE = 100;

const MIN_BASE_PRICE = 50;
const MAX_BASE_PRICE = 200;

const MIN_OPTIONS_COUNT = 0;
const MAX_OPTIONS_COUNT = 5;

const MAX_DURATION = 3;

const POINTS_LENGTH = 20;

const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
dayjs.duration(DEFAULT_DURATION);

const abouts = new Set([
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
]);

const generateDescription = () => getRndArr(abouts, MAX_ABOUT_LENGTH, MIN_ABOUT_LENGTH).join(' ');

const generatePhotos = () => {
  const photosCount = getRandomInteger(MIN_PHOTOS_COUNT, MAX_PHOTOS_COUNT);
  const photosArray = [];
  for (let actionIndex = 0; actionIndex < photosCount; actionIndex++) {
    const photoUrl = { src: `http://picsum.photos/248/152?r=${Math.random()}`, description: generateDescription() };
    photosArray.push(photoUrl);
  }
  return photosArray;
};

const waypointTypes = new Set(['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant']);
const generateWaypointType = () => getRandomElement(waypointTypes);
export const getWaypointTypes = () => waypointTypes;

const towns = new Set(['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Choluteca', 'Comayagua', 'Puerto Cortés', 'La Lima', 'Danlí']);

export const destinations = new Map();
for (const town of towns) {
  destinations.set(town, { name: town, description: generateDescription(), pictures: generatePhotos() });
}

export const getTowns = () => towns;

const options = [
  {
    title: 'Order Uber',
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  },
  {
    title: 'Add luggage',
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  },
  {
    title: 'Rent a car',
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  },
  {
    title: 'Add breakfast',
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  },
  {
    title: 'Book tickets',
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  },
  {
    title: 'Switch to comfort',
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  },
  {
    title: 'Lunch in city',
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  },
  {
    title: 'Add meal',
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
  },
];

const generateOptions = () => getRndArr(options, MAX_OPTIONS_COUNT, MIN_OPTIONS_COUNT);

export const offers = new Map();
for (const waypointType of waypointTypes) {
  offers.set(waypointType.toLowerCase(), generateOptions());
}
console.log(offers);

const today = dayjs();
const maxDay = dayjs(today).add(MAX_DURATION, 'day');
const generateDate = (from, to) => {
  const daysGap = getRandomInteger(from.valueOf(), to.valueOf());
  return dayjs(daysGap);
};

export const points = [];
for (let actionIndex = 0; actionIndex < POINTS_LENGTH; actionIndex++) {
  const type = generateWaypointType();
  const town = getRandomElement(towns);
  const destination = destinations.get(town);
  const generatePoint = () => {
    const dateFrom = generateDate(today, maxDay);
    const dateTo = generateDate(dateFrom, maxDay);
    const point = {
      basePrice: getRandomInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
      dateFrom: dateFrom.toDate(),
      dateTo: dateTo.toDate(),
      id: actionIndex,
      isFavorite: Boolean(getRandomInteger(0, 1)),
      offers: getRndArr(offers.get(type.toLowerCase()), undefined, 0),
      type,
      destination,
    };
    return point;
  };
  points.push(generatePoint());
}

export const getPoints = () => points;

export const getRandomRoute = (routePoints) => getRndArr(routePoints.slice(1));
