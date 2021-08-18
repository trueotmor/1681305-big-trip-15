import TripRouteView from './trip-route';
import TripCostView from './trip-cost';
import AbstractView from '../abstract';

const createTripInfo = (route) => `<section class="trip-main__trip-info  trip-info">
  ${new TripRouteView(route).getTemplate()}
  ${new TripCostView(route).getTemplate()}
  </section>`;

export default class TripInfo extends AbstractView {
  constructor(route) {
    super();
    this._route = route;
  }

  getTemplate() {
    return createTripInfo(this._route);
  }
}
