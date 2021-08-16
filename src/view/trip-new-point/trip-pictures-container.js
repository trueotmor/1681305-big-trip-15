import { createElement } from '../../utils/utils';
import TripPictures from './trip-pictures';

const pictures = (task) => new TripPictures.getElement(task);

const createPicturesContainer = (task) => {
  if (task.destination.pictures.length === 0) {
    return '';
  } else {
    return `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures(task)}
        </div>
      </div>`;
  }
};

export default class TripPicturesContainer {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  getTemplate() {
    return createPicturesContainer(this._task);
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
