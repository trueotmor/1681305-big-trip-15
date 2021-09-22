import flatpickr from 'flatpickr';
require('flatpickr/dist/themes/material_blue.css');

import PointDescriptionView from './trip-point-description.js';
import SmartView from '../smart.js';
import PointOffersView from './trip-point-offers.js';

import '../../../node_modules/flatpickr/dist/flatpickr.min.css';

import dayjs from 'dayjs';
import he from 'he';

const createTypesTemplate = (eventType, isChecked, isDisabled) => {
  const checked = isChecked ? 'checked' : '';
  const disabled = isDisabled ? 'disabled' : '';

  return `<div class="event__type-item">
            <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}"${checked}${disabled}>
            <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
          </div>`;
};

const createDataListItemsTemplate = (towns) => {
  const createTownItemTemplate = (townItem = '') => `<option value="${townItem}"></option>`;
  const townItems = towns.map((townItem) => createTownItemTemplate(townItem)).join('');
  return townItems;
};

const createButtonsTemplate = (id, isDisabled, isSaving, isDeleting) => {
  if (id) {
    return `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
              ${isSaving ? 'Saving...' : 'Save'}
            </button>
            <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
              ${isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>`;
  } else {
    return `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
              ${isSaving ? 'Saving...' : 'Save'}
            </button>
            <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
              Cancel
            </button>`;
  }
};

const createPointTemplate = (data, towns, types) => {
  const {
    type = '',
    id = 0,
    basePrice = 0,
    dateFrom = dayjs().toDate(),
    dateTo = dayjs().toDate(),
    destination = {},
    isDisabled,
    isSaving,
    isDeleting,
    offersList,
    offers,
  } = data;

  const town = destination.name ? destination.name : '';
  const eventTypeItems = types.map((eventType) => createTypesTemplate(eventType, type === eventType), isDisabled).join('');
  const offersComponent = new PointOffersView(offersList, offers);
  const offersDescription = new PointDescriptionView(data.destination);
  const offerItems = offersList.length ? offersComponent.getTemplate() : '';
  const description = Object.keys(data.destination).length > 1 ? offersDescription.getTemplate() : '';

  const formButtonsTemplate = createButtonsTemplate(id, isDisabled, isSaving, isDeleting);

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${eventTypeItems}
                    </fieldset>
                  </div>
                </div>
                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
                  value="${he.encode(town)}" list="destination-list-1" placeholder = "Please select your destination" ${isDisabled ? 'disabled' : ''} required>
                  <datalist id="destination-list-1">
                    ${createDataListItemsTemplate(towns)}
                  </datalist>
                </div>
                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
                  value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
                  value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
                </div>
                <div class="event__field-group  event__field-group--price">
                  <style> input[type='number'] { -moz-appearance:textfield;} input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none;}
                  </style>
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="number" min="50" name="event-price"
                  value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
                </div>
                ${formButtonsTemplate}
              </header>
              <section class="event__details">
              ${offerItems}
              ${description}
              </section>
            </form>
          </li>`;
};

export default class TripPointFormView extends SmartView {
  constructor(point, pointsModel, offersModel, destinationsModel) {
    super();
    this._point = point;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._data = this._pointsModel.parsePointToData(this._point);
    this._towns = this._destinationsModel.getDestinations().map((item) => item['name']);
    this._types = this._offersModel.getOffers().map((item) => item['type']);
    this._offersList = this._offersModel.getOffers().find((item) => item.type === this._point.type).offers;

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
    return createPointTemplate(this._data, this._towns, this._types);
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
    if (this._data.offersList.length) {
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
    this.updateData({ dateFrom: userDateFrom }, true);
  }

  _dateToChangeHandler([userDateTo]) {
    this.updateData({ dateTo: userDateTo }, true);
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    const updatedOffers = this._data.offers;
    const offerIndex = this._data.offers.map((offerItem) => offerItem.title).indexOf(evt.target.id);
    if (offerIndex !== -1) {
      evt.target.removeAttribute('checked');
      updatedOffers.splice(offerIndex, 1);
    } else {
      evt.target.setAttribute('checked', 'checked');
      updatedOffers.push(this._data.offersList.find((offerItem) => offerItem.title === evt.target.id));
    }
    this.updateData({ offers: Object.assign([], updatedOffers) }, true);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({ basePrice: Number(evt.target.value) && Number(evt.target.value) > 0 ? Number(evt.target.value) : 0 }, true);
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({ type: evt.target.value, offers: [] });
  }

  _townToggleHandler(evt) {
    evt.preventDefault();
    if (this._towns.indexOf(evt.target.value) !== -1) {
      this.getElement().querySelector('.event__save-btn').removeAttribute('disabled');
      this.updateData({ destination: this._destinationsModel.getDestinations().find((item) => item['name'] === evt.target.value) });
    } else {
      this.getElement().querySelector('.event__save-btn').setAttribute('disabled', 'disabled');
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
