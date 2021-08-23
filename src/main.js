import { getPoints, getRandomRoute } from './utils/temp/data.js';
import { render, renderPosition } from './utils/utils.js';

import TripFiltersView from './view/trip-filters.js';
import TripTabsView from './view/trip-tabs.js';
import TripSortView from './view/trip-sort.js';
import TripEventListView from './view/trip-event/trip-events-list.js';
import TripInfoView from './view/trip-info/trip-info';
import TripPointFormView from './view/trip-point-form/trip-point-form.js';
import TripEmptyListMessageView from './view/trip-list-empty.js';

const points = getPoints();
const formPoint = points[0];
const randomRoute = getRandomRoute(points);

// Existing markup
const pageHeaderElement = document.querySelector('.page-header');
const pageMainElement = document.querySelector('.page-main');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripTabsElement = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

// Route info: route , total price, dates.
const infoComponent = new TripInfoView(randomRoute);
render(tripMainElement, infoComponent.getElement(), renderPosition.AFTERBEGIN);

// Menu
render(tripTabsElement, new TripTabsView().getElement());

// Filters
render(tripFiltersElement, new TripFiltersView().getElement());

// New point form
const tripPointComponent = new TripPointFormView(formPoint);
render(tripEventsElement, tripPointComponent.getElement());

// Events

const renderRoute = (routeContainer, events) => {
  if (events.length === 0) {
    render(routeContainer, new TripEmptyListMessageView());
  } else {
    render(routeContainer, new TripSortView());
    const eventsListComponent = new TripEventListView(events);
    render(routeContainer, eventsListComponent.getElement());
  }
};

renderRoute(tripEventsElement, randomRoute);
