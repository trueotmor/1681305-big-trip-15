import { getRandomInteger } from '../utils/utils';
import { waypointTypes } from './temp/data';
import { towns } from './temp/data.js';
import { humanizeTaskDate } from '../utils/utils';


const createTypes = (set, task) => {
  let items = '';
  for (const item of set) {
    let checked = '';
    task.type === item ? checked = 'checked': checked;
    items += `
      <div class="event__type-item">
        <input id="event-type-${item.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.toLowerCase()}"${checked}>
        <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-1">${item}</label>
      </div>`;
  }
  return items;
};

const createOffers = (task) => {
  let items = '';
  for (const item of task.offers) {
    const isChecked = Boolean(getRandomInteger(0, 1));
    let checked = '';
    isChecked === true ? checked = 'checked' : checked;
    items += `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.title.toLowerCase().replace(/\s/g, '')}-1" type="checkbox" name="event-offer-${item.title.toLowerCase().replace(/\s/g, '')}" ${checked}>
          <label class="event__offer-label" for="event-offer-${item.title.toLowerCase().replace(/\s/g, '')}-1">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
          </label>
        </div>`;
  }
  return items;
};

const createOffersContainer = (task) => {
  if (createOffers(task) === '') {
    return '';
  } else {
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffers(task)}
      </div>
    </section>`;}
};

const createDestinationDescriptionContainer = (task) => {
  if (task.destination.description === '') {
    return '';
  } else {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${task.destination.description}</p>
    </section>`;}
};

const createDataListItems = (set) => {
  let items = '';
  for (const item of set) {
    items += `<option value="${item}"></option>`;
  }
  return items;
};


export const createEditPoint = (task) => {
  const typeValue = task.type.toLowerCase();
  const typeKey = task.type;

  const {destination, dateFrom, dateTo, basePrice} =  task;

  const dateFromFormatted = dateFrom !== null
    ? humanizeTaskDate(dateFrom, 'DD/MM/YY hh:mm')
    : '';

  const dateToFormatted = dateTo !== null
    ? humanizeTaskDate(dateTo, 'DD/MM/YY hh:mm')
    : '';

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${typeValue}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createTypes(waypointTypes, task)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${typeKey}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createDataListItems(towns)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromFormatted}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToFormatted}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    ${createOffersContainer(task)}
    ${createDestinationDescriptionContainer(task)}
  </section>
</form>`;
};
