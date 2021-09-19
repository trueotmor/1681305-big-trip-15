import TripPointFormView from '../view/trip-point-form/trip-point-form.js';
import { remove, render, renderPosition } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class NewPointForm {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    this._pointFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._pointFormComponent !== null) {
      return;
    }

    this._pointFormComponent = new TripPointFormView();
    this._pointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointFormComponent.setDeleteHandler(this._handleDeleteClick);

    render(this._container, this._pointFormComponent, renderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointFormComponent === null) {
      return;
    }

    remove(this._pointFormComponent);
    this._pointFormComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(UserAction.ADD_POINT, UpdateType.MAJOR, Object.assign({ id: nanoid() }, point));
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
  }

  _handleDeleteClick() {
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.destroy();
      document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
    }
  }
}
