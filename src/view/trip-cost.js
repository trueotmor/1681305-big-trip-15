import { getRandomRoute } from '../utils/temp/data.js';
import { getPoints } from '../utils/temp/data.js';


const randomRoute = getRandomRoute(getPoints());

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

export const createTripCost = () => (
  `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTotalPrice(randomRoute)}</span>
</p>`
);
