import {createTripInfo} from './view/trip-info.js';
import {createTripRoute} from './view/trip-route.js';
import {createTripCost} from './view/trip-cost.js';
import {createTripTabs} from './view/trip-tabs.js';
import {createTripFilters} from './view/trip-filters.js';
import {createTripSort} from './view/trip-sort.js';
import {createEmptyList} from './view/trip-list-empty.js';
import {createNewPoint} from './view/trip-new-point.js';
import {createEventList} from './view/trip-event-list.js';
import {createEventItem} from './view/trip-event-item.js';
import { getRandomRoute } from './utils/temp/data.js';
import { getPoints } from './utils/temp/data.js';
import { render } from './utils/utils.js';


const points = getPoints();
const randomRoute = getRandomRoute(points);


const siteHeaderelement = document.querySelector('.page-header');
const siteMainelement = document.querySelector('.page-main');

const tripMain = siteHeaderelement.querySelector('.trip-main');
const tripTabs = siteHeaderelement.querySelector('.trip-controls__navigation');
const tripFilters = siteHeaderelement.querySelector('.trip-controls__filters');

const tripEvts = siteMainelement.querySelector('.trip-events');


render(tripMain, createTripInfo(), 'afterbegin');
render(tripTabs, createTripTabs(), 'beforeend');
render(tripFilters, createTripFilters(), 'beforeend');

render(tripEvts, createTripSort(), 'beforeend');
render(tripEvts, createNewPoint(points[0]), 'beforeend');
createEmptyList();
render(tripEvts, createEventList(), 'beforeend');

const tripInfo = siteHeaderelement.querySelector('.trip-info');
render(tripInfo, createTripRoute(), 'afterbegin');
render(tripInfo, createTripCost(), 'beforeend');

const tripList = siteMainelement.querySelector('.trip-events__list');
render(tripList, createEventItem(randomRoute), 'beforeend');
