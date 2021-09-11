import AbstractView from '../abstract.js';
import { tripRoutePresenter } from '../../main.js';

const createNewEventTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class TripNewEventButtonView extends AbstractView {
  constructor() {
    super();
    this._newEventHandler = this._newEventHandler.bind(this);
  }

  getTemplate() {
    return createNewEventTemplate();
  }

  _newEventHandler(evt) {
    evt.preventDefault();
    tripRoutePresenter.createPoint();
    document.querySelector('.event__save-btn').disabled = true;
    document.querySelector('.trip-main__event-add-btn').disabled = true;
  }

  setNewEventCLickHandler() {
    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this._newEventHandler);
  }
}
