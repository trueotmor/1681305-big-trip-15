import AbstractView from '../abstract.js';

const calculateTotalPrice = (route) => {
  let basePrice = 0;
  route.forEach((e) => {
    basePrice += e.basePrice;
  });
  const totalPrice = basePrice;
  return totalPrice;
};

const createTripCostTemplate = (route) =>
  `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTotalPrice(route)}</span>
</p>`;

export default class TripCostView extends AbstractView {
  constructor(route) {
    super();
    this._route = route;
  }

  getTemplate() {
    return createTripCostTemplate(this._route);
  }
}
