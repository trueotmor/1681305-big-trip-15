import { createElement } from '../../utils/utils.js';
import { getWaypointTypes } from '../../utils/temp/data.js';
import { getTowns } from '../../utils/temp/data.js';
import { humanizeTaskDate } from '../../utils/utils.js';

const createTypes = (set, task) => {
  let items = '';
  for (const item of set) {
    let checked = '';
    task.type === item ? (checked = 'checked') : checked;
    items += `
      <div class="event__type-item">
        <input id="event-type-${item.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.toLowerCase()}"${checked}>
        <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-1">${item}</label>
      </div>`;
  }
  return items;
};

const createDataListItems = (set) => {
  let items = '';
  for (const item of set) {
    items += `<option value="${item}"></option>`;
  }
  return items;
};

const createNewPoint = (task) => {
  const typeValue = task.type.toLowerCase();
  const typeKey = task.type;

  const { destination, dateFrom, dateTo, basePrice } = task;

  const dateFromFormatted =
    dateFrom !== null ? humanizeTaskDate(dateFrom, 'full') : '';

  const dateToFormatted =
    dateTo !== null ? humanizeTaskDate(dateTo, 'full') : '';

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
          ${createTypes(getWaypointTypes(), task)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${typeKey}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
        destination.name
      }" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createDataListItems(getTowns())}
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
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
</form>`;
};

export default class NewPoint {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  getTemplate() {
    return createNewPoint(this._task);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
