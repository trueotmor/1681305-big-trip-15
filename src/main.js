import { getPoints, getRandomRoute } from './utils/temp/data.js';
import { renderPosition, render } from './utils/render.js';

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
render(tripMainElement, new TripInfoView(randomRoute), renderPosition.AFTERBEGIN);

// Menu
render(tripTabsElement, new TripTabsView());

// Filters
render(tripFiltersElement, new TripFiltersView());

// New point form
render(tripEventsElement, new TripPointFormView(formPoint));

// Events
const renderRoute = (routeContainer, events) => {
  if (events.length === 0) {
    render(routeContainer, new TripEmptyListMessageView());
  } else {
    render(routeContainer, new TripSortView());
    render(routeContainer, new TripEventListView(events));
  }
};

renderRoute(tripEventsElement, randomRoute);
