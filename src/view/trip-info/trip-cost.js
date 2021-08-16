import { createElement } from '../../utils/utils.js';

const calculateTotalPrice = (route) => {
  let basePrice = 0;
  let offersPrice = 0;
  route.forEach((e) => {
    e.offers.forEach((el) => {
      offersPrice += el.price;
    });
  });
  route.forEach((e) => {
    basePrice += e.basePrice;
  });
  const totalPrice = offersPrice + basePrice;
  return totalPrice;
};

const createTripCost = (route) =>
  `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTotalPrice(
    route,
  )}</span>
</p>`;

export default class TripCost {
  constructor(route) {
    this._route = route;
    this._element = null;
  }

  getTemplate() {
    return createTripCost(this._route);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
