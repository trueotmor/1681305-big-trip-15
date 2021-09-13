import AbstractView from '../abstract.js';

const createNewEventButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class TripNewEventButtonView extends AbstractView {
  constructor() {
    super();
    this._newEventHandler = this._newEventHandler.bind(this);
  }

  getTemplate() {
    return createNewEventButtonTemplate();
  }

  _newEventHandler(evt) {
    evt.preventDefault();
    this._callback.newEventClick();
  }

  setNewEventCLickHandler(callback) {
    this._callback.newEventClick = callback;
    this.getElement().addEventListener('click', this._newEventHandler);
  }
}
