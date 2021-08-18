import AbstractView from '../abstract';
import TripEvent from './trip-event.js';
import { render } from '../../utils/utils';
import { createElement } from '../../utils/utils';

const createEventItems = (route) => {
  let items = '';

  for (const point of route) {
    items += `<li class="trip-events__item">${new TripEvent(point).getTemplate()}</li>`;
  }
  return items;
};

const createEventList = (route) => `<ul class="trip-events__list">
    ${createEventItems(route)}
  </ul>`;

export default class TripEventList extends AbstractView {
  constructor(route) {
    super();
    this._route = route;
  }

  getTemplate() {
    return createEventList(this._route);
  }
}
