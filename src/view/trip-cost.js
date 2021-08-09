import { randomRoute } from './temp/data.js';
let basePrice = 0;
let offersPrice = 0;
randomRoute.forEach((e) => {
  e.offers.forEach((el) => {
    offersPrice += el.price;
  });
});
randomRoute.forEach((e) => {
  basePrice += e.basePrice;
});

const totalPrice = offersPrice + basePrice;

export const createTripCost = () => (
  `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
</p>`
);
