import { createEditPoint } from './trip-edit-point.js';
import { humanizeTaskDate } from '../utils/utils.js';
import { dateDifference } from '../utils/utils.js';
const createOffers = (task) => {
  let items = '';
  for (const item of task.offers) {
    items += `
      <li class="event__offer">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </li>`;
  }
  return items;
};

const createEventItemInner = (obj) => {
  const {dateFrom, dateTo, type, basePrice, destination} = obj;
  const dateFromTypeOne = dateFrom !== null
    ? humanizeTaskDate(dateFrom, 'YYYY-MM-DD')
    : '';
  const dateFromTypeTwo = dateFrom !== null
    ? humanizeTaskDate(dateFrom, 'MMM DD')
    : '';
  const timeFrom = dateFrom !== null
    ? humanizeTaskDate(dateFrom, 'hh:mm')
    : '';
  const dateToTypeOne = dateTo !== null
    ? humanizeTaskDate(dateTo, 'YYYY-MM-DD')
    : '';
  const dateToTypeTwo = dateTo !== null
    ? humanizeTaskDate(dateTo, 'MMM DD')
    : '';
  const timeTo = dateTo !== null
    ? humanizeTaskDate(dateTo, 'hh:mm')
    : '';
  const duration = dateDifference(dateTo, dateFrom, 'hour');

  return `<div class="event">
  <time class="event__date" datetime="${dateFromTypeOne}">${dateFromTypeTwo}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${destination.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFromTypeOne}T${timeFrom}">${dateFromTypeTwo} | ${timeFrom}</time>
      &mdash;
      <time class="event__end-time" datetime="${dateToTypeOne}T${timeTo}">${dateToTypeTwo} | ${timeTo}</time>
    </p>
    <p class="event__duration">${duration}H</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${createOffers(obj)}
  </ul>
  <button class="event__favorite-btn" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>`;
};

export const createEventItem = (arr) => {
  let items = '';
  items = `<li class="trip-events__item">${createEditPoint(arr[0])}</li>`;
  for (const item of arr) {
    items += `<li class="trip-events__item">${createEventItemInner(item)}</li>`;
  }
  return items;
};
