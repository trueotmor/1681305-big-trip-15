import PointOffersView from './trip-point-offers.js';
import PointDescriptionView from './trip-point-description.js';
import AbstractView from '../abstract.js';

const createPointDetails = (task) => `<section class="event__details">
    ${new PointOffersView(task).getTemplate()}
    ${new PointDescriptionView(task).getTemplate()}
  </section>`;

export default class PointDetails extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createPointDetails(this._task);
  }
}
