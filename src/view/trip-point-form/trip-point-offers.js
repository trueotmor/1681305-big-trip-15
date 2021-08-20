import { getRandomInteger } from '../../utils/utils.js';
import AbstractView from '../abstract.js';

const createOffersTemplate = (task) => {
  let items = '';
  for (const item of task.offers) {
    const title = `${item.title.toLowerCase().replace(/\s/g, '')}`;
    const isChecked = Boolean(getRandomInteger(0, 1));
    let checked = '';
    isChecked === true ? (checked = 'checked') : checked;
    items += `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${checked}>
          <label class="event__offer-label" for="event-offer-${title}-1">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
          </label>
        </div>`;
  }
  return items;
};

const createOffersContainerTemplate = (task) => {
  if (createOffersTemplate(task) === '') {
    return '';
  } else {
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffersTemplate(task)}
      </div>
    </section>`;
  }
};

export default class PointOffersView extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createOffersContainerTemplate(this._task);
  }
}
