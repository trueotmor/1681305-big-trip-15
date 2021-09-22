import AbstractView from '../abstract.js';
import PointPicturesView from './trip-pictures';

const createDescriptionTemplate = (destination) => {
  const { description = '', pictures = [] } = destination;
  const picturesComponent = new PointPicturesView(pictures).getTemplate();

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${picturesComponent}
          </section>`;
};
export default class PointDescriptionView extends AbstractView {
  constructor(destination) {
    super();
    this._destination = destination;
  }

  getTemplate() {
    return createDescriptionTemplate(this._destination);
  }
}
