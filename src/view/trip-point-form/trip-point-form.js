import flatpickr from 'flatpickr';
require('flatpickr/dist/themes/material_blue.css');

import { getTowns, getWaypointTypes } from '../../utils/temp/data.js';
import { humanizePointDate } from '../../utils/utils.js';

import PointDetailsView from './trip-point-details.js';
import SmartView from '../smart.js';
import PointsModel from '../../model/points.js';

import { destinations, offers } from '../../utils/temp/data.js';

import '../../../node_modules/flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

import he from 'he';

const BLANK_POINT = {
  type: 'bus',
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  offers: [],
  destination: {
    name: 'Please select a destination',
    description: '',
    pictures: [],
  },
  isFavotite: false,
};

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

const createPointTemplate = (data) => {
  if (data === undefined || null) {
    return '';
  }
  const typeValue = data.type.toLowerCase();
  const typeKey = data.type;

  const { destination, dateFrom, dateTo, basePrice, id } = data;

  const dateFromFormatted = dateFrom !== null ? humanizePointDate(dateFrom, 'full') : '';

  const dateToFormatted = dateTo !== null ? humanizePointDate(dateTo, 'full') : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
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
            ${createTypesTemplate(getWaypointTypes(), data)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${typeKey}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
          value="${he.encode(destination.name)}" list="destination-list-1">
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
    ${new PointDetailsView(data).getTemplate()}
    </form>
  </li>`;
};

export default class TripPointFormView extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    this._pointsModel = new PointsModel();
    this._data = this._pointsModel.parsePointToData(point);

    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formEditHandler = this._formEditHandler.bind(this);
    this._formDeleteHandler = this._formDeleteHandler.bind(this);

    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._townToggleHandler = this._townToggleHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();

    this._setDateFromPicker();
    this._setDateToPicker();
  }

  getTemplate() {
    return createPointTemplate(this._data);
  }

  removeElement() {
    super.removeElement();

    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
  }

  reset(point) {
    this.updateData(this._pointsModel.parsePointToData(point));
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this._setDateFromPicker();
    this._setDateToPicker();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormEditHandler(this._callback.edit);
    this.setDeleteHandler(this._callback.delete);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('#event-price-1').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeToggleHandler);
    if (this._data.offers.length) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offerChangeHandler);
    }
    this.getElement().querySelector('#event-destination-1').addEventListener('change', this._townToggleHandler);
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = flatpickr(this.getElement().querySelector('#event-start-time-1'), {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._data.dateFrom,
      maxDate: this._data.dateTo,
      ['time_24hr']: true,
      onClose: this._dateFromChangeHandler,
    });
  }

  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = flatpickr(this.getElement().querySelector('#event-end-time-1'), {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._data.dateTo,
      minDate: this._data.dateFrom,
      ['time_24hr']: true,
      onClose: this._dateToChangeHandler,
    });
  }

  _dateFromChangeHandler([userDateFrom]) {
    this.updateData(
      {
        dateFrom: userDateFrom,
      },
      true,
    );
  }

  _dateToChangeHandler([userDateTo]) {
    this.updateData(
      {
        dateTo: userDateTo,
      },
      true,
    );
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.checked) {
      const currentOffers = offers.get(this._data.type.toLowerCase());
      for (const offer of currentOffers) {
        if (offer.title === evt.target.value) {
          this._data.offers.push(offer);
          break;
        }
      }
    } else {
      let actionIndex = 0;
      for (const offer of this._data.offers) {
        if (offer.title === evt.target.value) {
          this._data.offers.splice(actionIndex, 1);
          break;
        }
        actionIndex++;
      }
    }

    this.updateData();
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData(
      {
        basePrice: Number(evt.target.value) && Number(evt.target.value) > 0 ? Number(evt.target.value) : 0,
      },
      true,
    );
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _townToggleHandler(evt) {
    evt.preventDefault();
    if ([...getTowns()].indexOf(evt.target.value) !== -1) {
      this.updateData({
        destination: destinations.get(evt.target.value),
      });
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._pointsModel.parseDataToPoint(this._data));
  }

  _formEditHandler(evt) {
    evt.preventDefault();
    this._callback.edit();
  }

  _formDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.delete(this._pointsModel.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  setFormEditHandler(callback) {
    this._callback.edit = callback;
    if (this._data.id) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formEditHandler);
    }
  }

  setDeleteHandler(callback) {
    this._callback.delete = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteHandler);
  }
}
