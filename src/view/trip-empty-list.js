import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no events',
  [FilterType.PAST]: 'There are no events',
};

const createEmptyListMessageTemplate = (filterType) => `<p class="trip-events__msg">${NoPointsTextType[filterType]}</p>`;

export default class TripEmptyListMessageView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createEmptyListMessageTemplate(this._data);
  }
}
