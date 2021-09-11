import AbstractView from '../abstract.js';
import { offers } from '../../utils/temp/data.js';

const createOffersTemplate = (data) => {
  let items = '';
  for (const item of offers.get(data.type.toLowerCase())) {
    const title = `${item.title.toLowerCase().replace(/\s/g, '')}`;
    let isChecked = false;
    for (const checkedItem of data.offers) {
      if (checkedItem.title === item.title) {
        isChecked = true;
        break;
      }
    }
    let checked = '';
    isChecked === true ? (checked = 'checked') : checked;
    items += `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${checked} value="${item.title}">
          <label class="event__offer-label" for="event-offer-${title}-1">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
          </label>
        </div>`;
  }
  return items;
};

const createOffersContainerTemplate = (data) => {
  if (createOffersTemplate(data) === '') {
    return '';
  } else {
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffersTemplate(data)}
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
