import { getPoints, getRandomRoute } from './utils/temp/data.js';
import TripPresenter from './presenter/trip.js';

const points = getPoints();
const randomRoute = getRandomRoute(points);

const tripRoutePresenter = new TripPresenter();
tripRoutePresenter.init(randomRoute);
