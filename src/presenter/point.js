import TripEventView from '../view/trip-event/trip-event.js';
import TripPointFormView from '../view/trip-point-form/trip-point-form.js';
import { replace, render, remove } from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPoint {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._formComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEdit = this._handleEdit.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormEsc = this._handleFormEsc.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavorite = this._handleFavorite.bind(this);
  }

  init(point) {
    this._point = point;

    const prevEventComponent = this._eventComponent;
    const prevFormComponent = this._formComponent;

    this._eventComponent = new TripEventView(point);
    this._formComponent = new TripPointFormView(point);

    this._eventComponent.setFormEditHandler(this._handleEdit);
    this._eventComponent.setAddFavoriteHandler(this._handleFavorite);

    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setFormEditHandler(this._handleFormEsc);

    this._reinit(prevEventComponent, prevFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._formComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _reinit(prevEventComponent, prevFormComponent) {
    if (prevEventComponent === null || prevFormComponent === null) {
      render(this._container, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._formComponent, prevFormComponent);
    }

    remove(prevEventComponent);
    remove(prevFormComponent);
  }

  _replaceEventToForm() {
    replace(this._formComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._formComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleEdit() {
    this._replaceEventToForm();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToEvent();
  }

  _handleFormEsc() {
    this._replaceFormToEvent();
  }

  _handleFavorite() {
    this._changeData(
      Object.assign({}, this._point, {
        isFavorite: !this._point.isFavorite,
      }),
    );
  }
}
