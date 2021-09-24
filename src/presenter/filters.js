import TripFiltersView from '../view/trip-filters.js';
import { render, replace, remove } from '../utils/render.js';
import { filter } from '../utils/filter.js';
import { UpdateType, FilterType } from '../const.js';

const filtersContainer = document.querySelector('.trip-controls__filters');

export default class Filters {
  constructor(pointsModel, filtersModel) {
    this._filtersContainer = filtersContainer;
    this._filtersModel = filtersModel;
    this._pointsModel = pointsModel;

    this._filtersComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFiltersComponent = this._filtersComponent;

    this._filtersComponent = new TripFiltersView(filters, this._filtersModel.getFilter());
    this._filtersComponent.setFilterTypeChangeHandler(this._handleFilterChange);

    if (prevFiltersComponent === null) {
      render(this._filtersContainer, this._filtersComponent);
      return;
    }
    replace(this._filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filterType) {
    if (this._filtersModel.getFilter() === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MAJOR, filterType);
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: filter[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filter[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: filter[FilterType.PAST](points).length,
      },
    ];
  }
}
