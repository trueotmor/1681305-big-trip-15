import { createElement } from '../../utils/utils';

const createTripInfoContainer = () =>
  `<section class="trip-main__trip-info  trip-info">
  </section>`;

export default class TripInfoContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInfoContainer();
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
