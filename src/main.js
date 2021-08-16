import { getPoints, getRandomRoute } from './utils/temp/data.js';
import { render, renderPosition } from './utils/utils.js';

import TripFiltersView from './view/trip-filters.js';
import TripTabsView from './view/trip-tabs.js';
import TripSortView from './view/trip-sort.js';
import TripCostView from './view/trip-info/trip-cost.js';
import TripRouteView from './view/trip-info/trip-route.js';
import TripEventList from './view/trip-events-container.js';
import TripEventView from './view/trip-events.js';
import TripInfoContainerView from './view/trip-info/trip-info-container';
import NewPointView from './view/trip-new-point/trip-new-point.js';
import PointDetailsContainerView from './view/trip-new-point/trip-new-point-details-container.js';
import PointOffersView from './view/trip-new-point/trip-new-point-offers.js';
import EditPointView from './view/trip-edit-point.js';
import TripDescriptionView from './view/trip-new-point/trip-new-point-description.js';
import TripPicturesView from './view/trip-new-point/trip-pictures.js';
import TripEmptyListMessageView from './view/trip-list-empty.js';

const points = getPoints();
const formPoint = points[0];
const randomRoute = getRandomRoute(points);

// Existing markup
const siteHeaderelement = document.querySelector('.page-header');
const siteMainelement = document.querySelector('.page-main');
const tripMain = siteHeaderelement.querySelector('.trip-main');
const tripTabs = siteHeaderelement.querySelector('.trip-controls__navigation');
const tripFilters = siteHeaderelement.querySelector('.trip-controls__filters');
const tripEvts = siteMainelement.querySelector('.trip-events');

// Route info: route , total price, dates.
const infoComponent = new TripInfoContainerView();
render(tripMain, infoComponent.getElement(), renderPosition.AFTERBEGIN);
render(
  infoComponent.getElement(),
  new TripRouteView(randomRoute).getElement(),
  renderPosition.AFTERBEGIN,
);
render(infoComponent.getElement(), new TripCostView(randomRoute).getElement());

// Menu
render(tripTabs, new TripTabsView().getElement());

// Filters
render(tripFilters, new TripFiltersView().getElement());

// Sort
render(tripEvts, new TripSortView().getElement());

// New point form
const tripNewPointComponent = new NewPointView(formPoint);
const tripNewPointDetailsContainer = new PointDetailsContainerView();
const tripNewPointDescription = new TripDescriptionView(formPoint);
render(tripEvts, tripNewPointComponent.getElement());
render(
  tripNewPointComponent.getElement(),
  tripNewPointDetailsContainer.getElement(),
);
render(
  tripNewPointDetailsContainer.getElement(),
  new PointOffersView(formPoint).getElement(),
  renderPosition.AFTERBEGIN,
);
render(
  tripNewPointDetailsContainer.getElement(),
  tripNewPointDescription.getElement(),
);
render(
  tripNewPointDescription.getElement(),
  new TripPicturesView(formPoint).getElement(),
);

// Events

// const replaceFormToEvent = (container, element) => {
//   const currentElement = element.getElement();
//   element.removeElement();
//   container.replaceChild(element.getElement(), currentElement);
// };

// const replaceEventToForm = (container, event, form) => {
//   event.getElement().innerHTML = '';
//   render(event.getElement(), form.getElement());

//   event
//     .getElement()
//     .querySelector('form')
//     .addEventListener('submit', (evt) => {
//       evt.preventDefault();
//       replaceFormToEvent(container, event);
//     });
// };

const getEditComponent = (component, event) => {
  const tripEditPointDetailsContainer = new PointDetailsContainerView();
  const tripEditPointDescription = new TripDescriptionView(event);
  const form = component.getElement().firstElementChild;
  render(form, tripEditPointDetailsContainer.getElement());
  render(
    tripEditPointDetailsContainer.getElement(),
    new PointOffersView(event).getElement(),
    renderPosition.AFTERBEGIN,
  );
  render(
    tripEditPointDetailsContainer.getElement(),
    tripEditPointDescription.getElement(),
  );
};

const renderEvent = (eventListElement, event) => {
  const eventComponent = new TripEventView(event);
  const eventEditComponent = new EditPointView(event);

  const replaceEventToForm = () => {
    eventListElement.replaceChild(
      eventEditComponent.getElement(),
      eventComponent.getElement(),
    );
    getEditComponent(eventEditComponent, event);
  };

  const replaceFormToEvent = () => {
    eventListElement.replaceChild(
      eventComponent.getElement(),
      eventEditComponent.getElement(),
    );
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

  eventEditComponent
    .getElement()
    .querySelector('form')
    .addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

  eventEditComponent
    .getElement()
    .querySelector('.event__rollup-btn')
    .addEventListener('click', () => {
      replaceFormToEvent();
      document.addEventListener('keydown', onEscKeyDown);
    });

  render(eventListElement, eventComponent.getElement());
};

if (points.length === 0) {
  render(tripEvts, new TripEmptyListMessageView().getElement());
}

const tripEventList = new TripEventList();

render(tripEvts, tripEventList.getElement());
for (const point of randomRoute) {
  renderEvent(tripEventList.getElement(), point);
}
