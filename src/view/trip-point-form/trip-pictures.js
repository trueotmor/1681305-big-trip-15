import AbstractView from '../abstract';

const createPicturesContainerTemplate = (pictures) => {
  const createDestinationPictureTemplate = (picture = {}) => {
    const src = picture.src ? picture.src : '';
    const pictureDescription = picture.description ? picture.description : '';

    return `<img class="event__photo" src="${src}" alt="${pictureDescription}">`;
  };

  const photos = pictures.map((picture) => createDestinationPictureTemplate(picture)).join('');
  return `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos}
        </div>
      </div>`;
};

export default class PointPicturesView extends AbstractView {
  constructor(pictures) {
    super();
    this._pictures = pictures;
  }

  getTemplate() {
    return createPicturesContainerTemplate(this._pictures);
  }
}
