import AbstractView from '../abstract';
import PointPicturesView from './trip-pictures';

const createDescriptionTemplate = (task) => {
  if (task.destination.description === '' && task.destination.pictures.length === 0) {
    return '';
  } else {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${task.destination.description}</p>
      ${new PointPicturesView(task).getTemplate()}
    </section>`;
  }
};

export default class PointDescriptionView extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createDescriptionTemplate(this._task);
  }
}
