import { humanizeTaskDate } from '../../utils/utils.js';
import AbstractView from '../abstract.js';

const createTripRoute = (route) => {
  if (route.length === 0) {
    return '';
  }
  const routeDateFrom = route[0].dateFrom !== null ? humanizeTaskDate(route[0].dateFrom, 'short') : '';
  const routeDateTo = route[route.length - 1].dateTo !== null ? humanizeTaskDate(route[route.length - 1].dateTo, 'short') : '';
  let routeList = '';
  routeList = route.map((elem) => elem.destination.name).join(' &mdash; ');
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${routeList}</h1>

    <p class="trip-info__dates">${routeDateFrom}&nbsp;&mdash;&nbsp;${routeDateTo}</p>
  </div>`;
};

export default class TripRoute extends AbstractView {
  constructor(route) {
    super();
    this._route = route;
  }

  getTemplate() {
    return createTripRoute(this._route);
  }
}
