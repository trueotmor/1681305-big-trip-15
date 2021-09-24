import TripEventListView from '../view/trip-event/trip-events-list.js';
import TripSortView from '../view/trip-sort.js';
import TripEmptyListMessageView from '../view/trip-empty-list.js';
import TripInfoView from '../view/trip-info/trip-info.js';
import TripSiteMenuView from '../view/trip-site-menu.js';
import TripPointPresenter from './trip-point.js';
import TripNewEventButtonView from '../view/trip-point-form/trip-new-event-button.js';
import TripStatisticsView from '../view/trip-stats.js';
import TripLoadingView from '../view/loading.js';

import OffersModel from '../model/offers.js';
import DestinationsModel from '../model/destinations.js';
import FiltersModel from '../model/filters.js';
import PointsModel from '../model/points.js';

import NewPointFormPresenter from './new-point-form.js';
import FiltersPresenter from '../presenter/filters.js';

import Api from '../api.js';

import { render, RenderPosition, remove } from '../utils/render.js';
import { getDateDifference } from '../utils/utils.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';
import { MenuItem, State, END_POINT, AUTHORIZATION } from '../const.js';

const pageHeaderElement = document.querySelector('.page-header');
const pageMainElement = document.querySelector('.page-main');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripSiteMenuElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const api = new Api(END_POINT, AUTHORIZATION);

const pointsPromise = api.getPoints();
const offersPromise = api.getOffers();
const destinationsPromise = api.getDestinations();

export default class Trip {
  constructor() {
    this._offersModel = new OffersModel();
    this._pointsModel = new PointsModel(this._offersModel);
    this._destinationsModel = new DestinationsModel();
    this._filtersModel = new FiltersModel();

    this._tripFilterPresenter = new FiltersPresenter(this._pointsModel, this._filtersModel);

    this._api = api;

    this._routeContainer = tripEventsElement;
    this._infoContainer = tripMainElement;
    this._siteMenuContainer = tripSiteMenuElement;

    this._eventPresenter = new Map();

    this._sortComponent = null;
    this._emptyListMessageComponent = null;
    this._statisticsComponent = null;

    this._currentSortType = SortType.Day;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;

    this._siteMenuComponent = new TripSiteMenuView();

    this._eventsListComponent = new TripEventListView();
    this._newEventButtonComponent = new TripNewEventButtonView();
    this._loadingComponent = new TripLoadingView();

    this._handleSortChange = this._handleSortChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);

    this._newPointFormPresenter = new NewPointFormPresenter(
      this._eventsListComponent,
      this._handleViewAction,
      this._pointsModel,
      this._offersModel,
      this._destinationsModel,
    );
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._renderRoute();

    document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      this.createPoint();
    });

    Promise.all([pointsPromise, offersPromise, destinationsPromise])
      .then(([points, offers, destinations]) => {
        this._offersModel.setOffers(offers);
        this._destinationsModel.setDestinations(destinations);
        this._pointsModel.setPoints(UpdateType.INIT, points);

        this._renderHeader();
        render(this._siteMenuContainer, this._siteMenuComponent);
        this._tripFilterPresenter.init();
        this._newEventButtonComponent.setNewPointClickHandler(this._handleNewPointClick);
        this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuClick);
      })
      .catch(() => {
        this._renderHeader();
        render(this._siteMenuContainer, this._siteMenuComponent);
        this._tripFilterPresenter.init();
        this._newEventButtonComponent.setNewPointClickHandler(this._handleNewPointClick);
        this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuClick);
      });
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
    document.querySelector('.event__save-btn').setAttribute('disabled', 'disabled');
    document.querySelector('.trip-main__event-add-btn').setAttribute('disabled', 'disabled');
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
          a = getDateDifference(a.dateTo, a.dateFrom, 'hour');
          b = getDateDifference(b.dateTo, b.dateFrom, 'hour');
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
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
  }

  _renderInfo() {
    if (this._infoComponent) {
      remove(this._infoComponent);
    }
    this._infoComponent = new TripInfoView(this._pointsModel.getPoints());
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
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

  _handleNewPointClick() {
    remove(this._statisticsComponent);
    this.destroy();
    this._setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.init();
    this.createPoint();
  }

  _renderEmptyListMessage() {
    if (this._emptyListMessageComponent) {
      remove(this._emptyListMessageComponent);
    }

    this._emptyListMessageComponent = new TripEmptyListMessageView(this._filterType);
    render(this._routeContainer, this._emptyListMessageComponent);
  }

  _renderLoading() {
    render(this._routeContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new TripPointPresenter(
      this._eventsListComponent,
      this._handleViewAction,
      this._handleModeChange,
      this._pointsModel,
      this._offersModel,
      this._destinationsModel,
    );
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
    remove(this._loadingComponent);

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
        this._eventPresenter.get(update.id).setViewState(State.SAVING);
        this._api
          .updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
            this._renderHeader();
          })
          .catch(() => {
            this._eventPresenter.get(update.id).setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._newPointFormPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
          this._renderHeader();
        });
        break;
      case UserAction.DELETE_POINT:
        this._eventPresenter.get(update.id).setViewState(State.DELETING);
        this._api
          .deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
            this._renderHeader();
          })
          .catch(() => {
            this._eventPresenter.get(update.id).setViewState(State.ABORTING);
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderRoute();
        break;
    }
  }

  _handleSiteMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.TABLE:
        this.destroy();
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
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
