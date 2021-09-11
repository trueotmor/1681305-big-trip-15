import AbstractView from '../abstract';

const createPicturesTemplate = (task) => {
  const { destination } = task;

  let items = '';
  for (let actionIndex = 0; actionIndex < destination.pictures.length; actionIndex++) {
    items += `<img class="event__photo" src="${destination.pictures[actionIndex].src}" alt="Event photo">`;
  }
  return items;
};

const createPicturesContainerTemplate = (task) => {
  if (task.destination.pictures.length === 0) {
    return '';
  } else {
    return `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPicturesTemplate(task)}
        </div>
      </div>`;
  }
};

export default class PointPicturesView extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createPicturesContainerTemplate(this._task);
  }
}
