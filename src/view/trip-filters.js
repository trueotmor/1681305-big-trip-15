import AbstractView from './abstract.js';

const createTripFilterTemplate = (filter, currentFilterType) =>
  `<div class="trip-filters__filter">
    <input
    id="filter-${filter.name}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio" name="trip-filter"
    value="${filter.type}"
    ${filter.type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
  </div>`;

const createTripFiltersTemplate = (filters, currentFilterType) => {
  const filterTemplate = filters.map((filter) => createTripFilterTemplate(filter, currentFilterType)).join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class TripFiltersView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
