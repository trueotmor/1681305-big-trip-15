import { getPoints, getRandomRoute } from './utils/temp/data.js';
import { render, renderPosition, replace } from './utils/utils.js';

import TripFiltersView from './view/trip-filters.js';
import TripTabsView from './view/trip-tabs.js';
import TripSortView from './view/trip-sort.js';
import TripEventListView from './view/trip-event/trip-events-list.js';
import TripEventView from './view/trip-event/trip-event.js';
import TripInfoView from './view/trip-info/trip-info';
import PointFormView from './view/trip-point-form/trip-point-form.js';
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
const tripPointComponent = new PointFormView(formPoint);
render(tripEventsElement, tripPointComponent.getElement());

// Events

// if (points.length === 0) {
//   render(tripEventsElement, new TripEmptyListMessageView().getElement());
// }

// const tripEventList = new TripEventListView(randomRoute);
// render(tripEventsElement, tripEventList.getElement());

const renderEvent = (eventsListContainer, event) => {
  const eventComponent = new TripEventView(event);
  const eventFormComponent = new PointFormView(event);

  const replaceEventToForm = () => {
    replace(eventFormComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, eventFormComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent
    .getElement()
    .querySelector('.event__rollup-btn')
    .addEventListener('click', () => {
      replaceEventToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

  eventFormComponent
    .getElement()
    .querySelector('form')
    .addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

  eventFormComponent
    .getElement()
    .querySelector('.event__rollup-btn')
    .addEventListener('click', () => {
      replaceFormToEvent();
      document.addEventListener('keydown', onEscKeyDown);
    });

  render(eventsListContainer, eventComponent.getElement());
};

const renderRoute = (routeContainer, events) => {
  if (points.length === 0) {
    render(routeContainer, new TripEmptyListMessageView());
  } else {
    render(routeContainer, new TripSortView());
    const eventsListComponent = new TripEventListView(events);
    render(routeContainer, eventsListComponent);
    // for (let i = 0; i < events.length; i++) {
    //   renderEvent(eventsListComponent, events[i]);
    // }
  }
};

renderRoute(tripEventsElement, points);
