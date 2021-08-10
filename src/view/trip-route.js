import dayjs from 'dayjs';
import { getRandomRoute } from '../utils/temp/data.js';
import { getPoints } from '../utils/temp/data.js';
const randomRoute = getRandomRoute(getPoints());

export const createTripRoute = () => {
  const routeDateFrom = randomRoute[0].dateFrom !== null ? dayjs(randomRoute[0].dateFrom).format('MMM DD') : '';
  const routeDateTo = randomRoute[randomRoute.length-1].dateTo !== null ? dayjs(randomRoute[randomRoute.length-1].dateTo).format('MMM DD') : '';
  let route = '';
  route = randomRoute.map((elem)=>elem.destination.name).join(' &mdash; ');
  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${route}</h1>

    <p class="trip-info__dates">${routeDateFrom}&nbsp;&mdash;&nbsp;${routeDateTo}</p>
  </div>`;
};


