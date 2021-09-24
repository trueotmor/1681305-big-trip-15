import { humanizePointDate } from '../../utils/utils.js';
import AbstractView from '../abstract.js';

const createTripRouteTemplate = (route) => {
  if (route.length === 0) {
    return '';
  }
  const routeDateFrom = route[0].dateFrom !== null ? humanizePointDate(route[0].dateFrom, 'short') : '';
  const routeDateTo = route[route.length - 1].dateTo !== null ? humanizePointDate(route[route.length - 1].dateTo, 'short') : '';
  let routeList = '';

  if (route.length < 4 && route.length > 0) {
    routeList = `${route.map((elem) => elem.destination.name).join(' &mdash; ')}`;
  } else {
    routeList = `${route[0].destination.name} — ... — ${route[route.length - 1].destination.name}`;
  }

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${routeList}</h1>

    <p class="trip-info__dates">${routeDateFrom}&nbsp;&mdash;&nbsp;${routeDateTo}</p>
  </div>`;
};

export default class TripRouteView extends AbstractView {
  constructor(route) {
    super();
    this._route = route;
  }

  getTemplate() {
    return createTripRouteTemplate(this._route);
  }
}
