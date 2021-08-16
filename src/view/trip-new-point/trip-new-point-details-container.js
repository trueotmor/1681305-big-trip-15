import { createElement } from '../../utils/utils.js';

const createNewPointDetailsContainer = () =>
  `<section class="event__details">
  </section>`;

export default class NewPointDetailsContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNewPointDetailsContainer();
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
