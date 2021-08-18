import AbstractView from './abstract.js';

const createEmptyListMessage = () =>
  `<p class="trip-events__msg">Click New Event to create your first point
  </p>`;

export default class TripEmptyListMessage extends AbstractView {
  getTemplate() {
    return createEmptyListMessage();
  }
}
