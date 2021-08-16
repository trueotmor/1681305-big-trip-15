import { createElement } from '../utils/utils.js';

const createEmptyListMessage = () =>
  `<p class="trip-events__msg">Click New Event to create your first point
  </p>`;

export default class TripEmptyListMessage {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyListMessage();
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
