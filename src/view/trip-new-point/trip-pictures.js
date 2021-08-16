import { createElement } from '../../utils/utils';

const createPictures = (task) => {
  const { destination } = task;
  let items = '';
  for (
    let actionIndex = 0;
    actionIndex < destination.pictures.length;
    actionIndex++
  ) {
    items += `<img class="event__photo" src="${destination.pictures[actionIndex]}" alt="Event photo">`;
  }
  return items;
};

const createPicturesContainer = (task) => {
  if (task.destination.pictures.length === 0) {
    return '';
  } else {
    return `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPictures(task)}
        </div>
      </div>`;
  }
};

export default class TripPictures {
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
