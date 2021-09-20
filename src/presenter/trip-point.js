import TripEventView from '../view/trip-event/trip-event.js';
import TripPointFormView from '../view/trip-point-form/trip-point-form.js';
import { replace, render, remove } from '../utils/render.js';
import { Mode, UserAction, UpdateType, State } from '../const.js';

export default class TripPoint {
  constructor(container, changeData, changeMode, pointsModel) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._formComponent = null;
    this._mode = Mode.DEFAULT;

    this._pointsModel = pointsModel;

    this._handleEdit = this._handleEdit.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormEsc = this._handleFormEsc.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavorite = this._handleFavorite.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  init(point) {
    this._point = point;

    const prevEventComponent = this._eventComponent;
    const prevFormComponent = this._formComponent;

    this._eventComponent = new TripEventView(point);
    this._formComponent = new TripPointFormView(point, this._pointsModel);

    this._eventComponent.setFormEditHandler(this._handleEdit);
    this._eventComponent.setAddFavoriteHandler(this._handleFavorite);

    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setFormEditHandler(this._handleFormEsc);

    this._formComponent.setDeleteHandler(this._handleDelete);

    this._reinit(prevEventComponent, prevFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._formComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._formComponent.reset(this._point);
      this._replaceFormToEvent();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._formComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._formComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._formComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._formComponent.shake(resetFormState);
        break;
    }
  }

  _reinit(prevEventComponent, prevFormComponent) {
    if (prevEventComponent === null || prevFormComponent === null) {
      render(this._container, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    } else {
      replace(this._eventComponent, prevFormComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevFormComponent);
  }

  _replaceEventToForm() {
    replace(this._formComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
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

  _handleFormSubmit(update) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, update);
  }

  _handleFormEsc() {
    this._formComponent.reset(this._point);
    this._replaceFormToEvent();
  }

  _handleFavorite() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign({}, this._point, {
        isFavorite: !this._point.isFavorite,
      }),
    );
  }

  _handleDelete(point) {
    this._changeData(UserAction.DELETE_POINT, UpdateType.MAJOR, point);
  }
}
