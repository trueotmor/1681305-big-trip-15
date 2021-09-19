import TripEventListView from '../view/trip-event/trip-events-list.js';
import TripSortView from '../view/trip-sort.js';
import TripEmptyListMessageView from '../view/trip-empty-list.js';
import TripInfoView from '../view/trip-info/trip-info.js';
import TripSiteMenuView from '../view/trip-site-menu.js';
import TripPointPresenter from './trip-point.js';
import TripNewEventButtonView from '../view/trip-point-form/trip-new-event-button.js';
import NewPointFormPresenter from './new-point-form.js';
import TripStatisticsView from '../view/trip-stats.js';

import { render, renderPosition, remove } from '../utils/render.js';
import { dateDifference } from '../utils/utils.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';
import { MenuItem } from '../const.js';

const pageHeaderElement = document.querySelector('.page-header');
const pageMainElement = document.querySelector('.page-main');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripSiteMenuElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

export default class Trip {
  constructor(pointsModel, filtersModel) {
    this._pointsModel = pointsModel;
    this._filtersModel = filtersModel;

    this._routeContainer = tripEventsElement;
    this._infoContainer = tripMainElement;
    this._siteMenuContainer = tripSiteMenuElement;

    this._eventPresenter = new Map();

    this._sortComponent = null;
    this._emptyListMessageComponent = null;
    this._statisticsComponent = null;

    this._currentSortType = SortType.Day;
    this._filterType = FilterType.EVERYTHING;

    this._siteMenuComponent = new TripSiteMenuView();

    this._eventsListComponent = new TripEventListView();
    this._newEventButtonComponent = new TripNewEventButtonView();

    this._handleSortChange = this._handleSortChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);

    this._newPointFormPresenter = new NewPointFormPresenter(this._eventsListComponent, this._handleViewAction);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._renderHeader();
    this._renderRoute();
    this._newEventButtonComponent.setNewPointClickHandler();
  }

  destroy() {
    this._clearRoute({ resetSortType: true });

    remove(this._eventsListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this._currentSortType = SortType.Day;
    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointFormPresenter.init();
  }

  _getPoints() {
    this._filterType = this._filtersModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._filterType](points);

    switch (this._currentSortType) {
      case SortType.Day:
        return filteredPoints.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
      case SortType.Duration:
        return filteredPoints.sort((a, b) => {
          a = dateDifference(a.dateTo, a.dateFrom, 'hour');
          b = dateDifference(b.dateTo, b.dateFrom, 'hour');
          return a - b;
        });
      case SortType.Price:
        return filteredPoints.sort((a, b) => a.basePrice - b.basePrice);
    }

    return filteredPoints;
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearRoute();
    this._renderRoute();
  }

  _renderInfo() {
    if (this._infoComponent) {
      remove(this._infoComponent);
    }
    this._infoComponent = new TripInfoView(this._pointsModel.getPoints());
    render(this._infoContainer, this._infoComponent, renderPosition.AFTERBEGIN);
  }

  _renderTripSiteMenu() {
    render(this._siteMenuContainer, this._siteMenuComponent);
    this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuClick);
  }

  _renderSort() {
    if (this._sortComponent) {
      remove(this._sortComponent);
    }

    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new TripSortView(this._currentSortType);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);

    render(this._routeContainer, this._sortComponent);
  }

  _renderEmptyListMessage() {
    if (this._emptyListMessageComponent) {
      remove(this._emptyListMessageComponent);
    }

    this._emptyListMessageComponent = new TripEmptyListMessageView(this._filterType);
    render(this._routeContainer, this._emptyListMessageComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new TripPointPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._eventPresenter.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    render(this._routeContainer, this._eventsListComponent);
    for (let actionIndex = 0; actionIndex < points.length; actionIndex++) {
      this._renderPoint(points[actionIndex]);
    }
  }

  _clearRoute({ resetSortType = false } = {}) {
    this._newPointFormPresenter.destroy();
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();

    remove(this._sortComponent);

    if (this._emptyListMessageComponent) {
      remove(this._emptyListMessageComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.Day;
    }
  }

  _handleModeChange() {
    this._newPointFormPresenter.destroy();
    this._eventPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearRoute();
        this._renderRoute();
        break;
      case UpdateType.MAJOR:
        this._clearRoute({ resetSortType: true });
        this._renderRoute();
        break;
    }
  }

  _handleSiteMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.TABLE:
        this.init();
        remove(this._statisticsComponent);
        this._siteMenuComponent.setMenuItem(MenuItem.TABLE);
        document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
        document.querySelectorAll('.trip-filters__filter-input').forEach((item) => item.removeAttribute('disabled'));
        break;
      case MenuItem.STATS:
        this.destroy();
        remove(this._statisticsComponent);
        this._statisticsComponent = new TripStatisticsView(this._pointsModel.getPoints());
        render(tripEventsElement, this._statisticsComponent);
        this._siteMenuComponent.setMenuItem(MenuItem.STATS);
        document.querySelectorAll('.trip-filters__filter-input').forEach((item) => item.setAttribute('disabled', 'disabled'));
        document.querySelector('.trip-main__event-add-btn').setAttribute('disabled', 'disabled');
        break;
    }
  }

  _renderHeader() {
    this._renderInfo(this._getPoints());
    this._renderTripSiteMenu();
  }

  _renderRoute() {
    const points = this._getPoints();
    const pointsCount = points.length;
    if (pointsCount === 0) {
      this._renderEmptyListMessage();
      return;
    }
    this._renderSort();
    this._renderPoints(this._getPoints());
  }
}
