import { getPoints } from './utils/temp/data.js';
import TripPresenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import PointsModel from './model/points.js';
import FiltersModel from './model/filters.js';

const points = getPoints();

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filtersModel = new FiltersModel();

const tripRoutePresenter = new TripPresenter(pointsModel, filtersModel);
tripRoutePresenter.init();
const tripFilterPresenter = new FiltersPresenter(pointsModel, filtersModel);
tripFilterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripRoutePresenter.createPoint();
});
