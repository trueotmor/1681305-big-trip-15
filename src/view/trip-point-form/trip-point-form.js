import { getTowns, getWaypointTypes } from '../../utils/temp/data.js';
import { humanizeTaskDate } from '../../utils/utils.js';

import PointDetailsView from './trip-point-details.js';
import AbstractView from '../abstract.js';

const createTypesTemplate = (set, point) => {
  let items = '';
  for (const item of set) {
    const checked = point.type === item ? 'checked' : '';
    items += `
      <div class="event__type-item">
        <input id="event-type-${item.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.toLowerCase()}"${checked}>
        <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-1">${item}</label>
      </div>`;
  }
  return items;
};

const createDataListItemsTemplate = (set) => {
  let items = '';
  for (const item of set) {
    items += `<option value="${item}"></option>`;
  }
  return items;
};

const createButtonsTemplate = (id) => {
  if (id) {
    return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
  </button>`;
  } else {
    return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>`;
  }
};

const createPointTemplate = (point) => {
  if (point === undefined || null) {
    return '';
  }
  const typeValue = point.type.toLowerCase();
  const typeKey = point.type;

  const { destination, dateFrom, dateTo, basePrice, id } = point;

  const dateFromFormatted = dateFrom !== null ? humanizeTaskDate(dateFrom, 'full') : '';

  const dateToFormatted = dateTo !== null ? humanizeTaskDate(dateTo, 'full') : '';

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
          ${createTypesTemplate(getWaypointTypes(), point)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${typeKey}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
        value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createDataListItemsTemplate(getTowns())}
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

    ${createButtonsTemplate(id)}

  </header>
  ${new PointDetailsView(point).getTemplate()}
</form>`;
};

export default class TripPointFormView extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }
}
