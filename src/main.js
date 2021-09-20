import { END_POINT, AUTHORIZATION } from './const.js';
import TripPresenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import PointsModel from './model/points.js';
import FiltersModel from './model/filters.js';
import { UpdateType } from './const.js';

import Api from './api.js';

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();

const tripRoutePresenter = new TripPresenter(pointsModel, filtersModel, api);
tripRoutePresenter.init();

const tripFilterPresenter = new FiltersPresenter(pointsModel, filtersModel);

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripRoutePresenter.createPoint();
});

api
  .getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    tripFilterPresenter.init();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    tripFilterPresenter.init();
  });
