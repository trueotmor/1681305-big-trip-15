import TripEventListView from '../view/trip-event/trip-events-list.js';
import TripSortView from '../view/trip-sort.js';
import TripEmptyListMessageView from '../view/trip-empty-list.js';
import TripInfoView from '../view/trip-info/trip-info.js';
import TripTabsView from '../view/trip-tabs.js';
import TripFiltersView from '../view/trip-filters.js';
import TripPointFormView from '../view/trip-point-form/trip-point-form.js';
import TripPointPresenter from './trip-point.js';

import { render, renderPosition } from '../utils/render.js';
import { dateDifference, updateItem } from '../utils/utils.js';

const pageHeaderElement = document.querySelector('.page-header');
const pageMainElement = document.querySelector('.page-main');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripTabsElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const sortTypes = new TripSortView().sortTypes;

export default class Trip {
  constructor() {
    this._routeContainer = tripEventsElement;
    this._infoContainer = tripMainElement;
    this._tabsContainer = tripTabsElement;
    this._filtersContainer = tripFiltersElement;

    this._eventPresenter = new Map();

    this._sortComponent = new TripSortView();
    this._emptyListMessageComponent = new TripEmptyListMessageView();
    this._tabsComponent = new TripTabsView();
    this._filtersComponent = new TripFiltersView();
    this._eventsListComponent = new TripEventListView();

    this._handleSortChange = this._handleSortChange.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._renderHeader();
    this._renderRoute();
    this._renderNewPointForm();
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case sortTypes.Day:
        this._points.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
        break;
      case sortTypes.Duration:
        this._points.sort((a, b) => {
          a = dateDifference(a.dateTo, a.dateFrom, 'hour');
          b = dateDifference(b.dateTo, b.dateFrom, 'hour');
          return a - b;
        });
        break;
      case sortTypes.Price:
        this._points.sort((a, b) => a.basePrice - b.basePrice);
        break;
      default:
    }

    this._currentSortType = sortType;
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEvents();
    this._renderEvents();
  }

  _renderInfo() {
    this._infoComponent = new TripInfoView(this._points);
    render(this._infoContainer, this._infoComponent, renderPosition.AFTERBEGIN);
  }

  _renderTripTabs() {
    render(this._tabsContainer, this._tabsComponent);
  }

  _renderFilters() {
    render(this._filtersContainer, this._filtersComponent);
  }

  _renderSort() {
    render(this._routeContainer, this._sortComponent);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);
  }

  _renderEmptyListMessage() {
    render(this._routeContainer, this._emptyListMessageComponent);
  }

  _renderEvent(point) {
    const pointPresenter = new TripPointPresenter(this._eventsListComponent, this._handleEventChange, this._handleModeChange);
    pointPresenter.init(point);
    this._eventPresenter.set(point.id, pointPresenter);
  }

  _renderEvents() {
    render(this._routeContainer, this._eventsListComponent);
    for (let actionIndex = 0; actionIndex < this._points.length; actionIndex++) {
      this._renderEvent(this._points[actionIndex]);
    }
  }

  _clearEvents() {
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();
  }

  _renderNewPointForm() {
    // временные данные для формы
    const newFormTempData = { ...this._points[0] };
    delete newFormTempData.id;
    const newPointForm = new TripPointFormView(newFormTempData);
    render(this._eventsListComponent, newPointForm, renderPosition.AFTERBEGIN);
  }

  _handleEventChange(updatedEvent) {
    this._points = updateItem(this._points, updatedEvent);
    this._eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  _handleModeChange() {
    this._eventPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderHeader() {
    this._renderInfo(this._points);
    this._renderTripTabs();
    this._renderFilters();
  }

  _renderRoute() {
    if (this._points.length === 0) {
      this._renderEmptyListMessage();
    } else {
      this._renderSort();
      this._renderEvents();
    }
  }
}
