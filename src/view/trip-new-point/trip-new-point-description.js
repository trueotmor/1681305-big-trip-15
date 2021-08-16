import { createElement } from '../../utils/utils';

const createDescription = (task) => {
  if (
    task.destination.description === '' &&
    task.destination.pictures.length === 0
  ) {
    return '';
  } else {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${task.destination.description}</p>
    </section>`;
  }
};

export default class TripDescription {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  getTemplate() {
    return createDescription(this._task);
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
