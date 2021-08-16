import { createElement } from '../../utils/utils.js';
import { getRandomInteger } from '../../utils/utils.js';

const createOffers = (task) => {
  let items = '';
  for (const item of task.offers) {
    const isChecked = Boolean(getRandomInteger(0, 1));
    let checked = '';
    isChecked === true ? (checked = 'checked') : checked;
    items += `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.title
            .toLowerCase()
            .replace(
              /\s/g,
              '',
            )}-1" type="checkbox" name="event-offer-${item.title
      .toLowerCase()
      .replace(/\s/g, '')}" ${checked}>
          <label class="event__offer-label" for="event-offer-${item.title
            .toLowerCase()
            .replace(/\s/g, '')}-1">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
          </label>
        </div>`;
  }
  return items;
};

const createOffersContainer = (task) => {
  if (createOffers(task) === '') {
    return '';
  } else {
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffers(task)}
      </div>
    </section>`;
  }
};

export default class NewPointOffers {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  getTemplate() {
    return createOffersContainer(this._task);
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
