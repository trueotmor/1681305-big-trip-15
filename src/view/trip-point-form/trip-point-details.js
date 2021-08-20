import PointOffersView from './trip-point-offers.js';
import PointDescriptionView from './trip-point-description.js';
import AbstractView from '../abstract.js';

const createPointDetailsTemplate = (task) => `<section class="event__details">
    ${new PointOffersView(task).getTemplate()}
    ${new PointDescriptionView(task).getTemplate()}
  </section>`;

export default class PointDetailsView extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createPointDetailsTemplate(this._task);
  }
}
