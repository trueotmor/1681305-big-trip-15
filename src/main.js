import { getPoints } from './utils/temp/data.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';

const points = getPoints();

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripRoutePresenter = new TripPresenter(pointsModel);
tripRoutePresenter.init();
