import AbstractView from '../abstract.js';

const createEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventListView extends AbstractView {
  getTemplate() {
    return createEventListTemplate();
  }
}
