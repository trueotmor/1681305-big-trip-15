import { humanizePointDate } from '../../utils/utils';
import { dateDifference } from '../../utils/utils';
import AbstractView from '../abstract';

import he from 'he';

const createOffersTemplate = (point) => {
  let items = '';
  for (const item of point.offers) {
    items += `
      <li class="event__offer">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </li>`;
  }
  return items;
};

const createEventItemInnerTemplate = (point) => {
  const { dateFrom, dateTo, type, basePrice, destination, isFavorite } = point;
  const dateFromTypeOne = dateFrom !== null ? humanizePointDate(dateFrom, 'common') : '';
  const dateFromTypeTwo = dateFrom !== null ? humanizePointDate(dateFrom, 'short') : '';
  const timeFrom = dateFrom !== null ? humanizePointDate(dateFrom, 'short') : '';
  const dateToTypeOne = dateTo !== null ? humanizePointDate(dateTo, 'common') : '';
  const dateToTypeTwo = dateTo !== null ? humanizePointDate(dateTo, 'short') : '';
  const timeTo = dateTo !== null ? humanizePointDate(dateTo, 'short') : '';
  const duration = dateDifference(dateTo, dateFrom, 'hour');

  const favoriteIsActive = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFromTypeOne}">${dateFromTypeTwo}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${he.encode(destination.name)}</h3>
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
        ${createOffersTemplate(point)}
      </ul>
      <button class="event__favorite-btn ${favoriteIsActive}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class TripEventView extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._formEditHandler = this._formEditHandler.bind(this);
    this._addFavoriteHandler = this._addFavoriteHandler.bind(this);
  }

  getTemplate() {
    return createEventItemInnerTemplate(this._point);
  }

  _formEditHandler(evt) {
    evt.preventDefault();
    this._callback.edit();
  }

  _addFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favorite();
  }

  setFormEditHandler(callback) {
    this._callback.edit = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formEditHandler);
  }

  setAddFavoriteHandler(callback) {
    this._callback.favorite = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._addFavoriteHandler);
  }
}
