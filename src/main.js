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
import {createEventItemInner} from './view/trip-event-item-inner.js';

import {createEditPoint} from './view/trip-edit-point.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

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
render(tripEvts, createNewPoint(), 'beforeend');
createEmptyList();
// render(tripEvts, createEmptyList(), 'beforeend');
render(tripEvts, createEventList(), 'beforeend');

const tripInfo = siteHeaderelement.querySelector('.trip-info');
render(tripInfo, createTripRoute(), 'afterbegin');
render(tripInfo, createTripCost(), 'beforeend');


const tripList = siteMainelement.querySelector('.trip-events__list');
render(tripList, createEventItem(), 'beforeend');
render(tripList, createEventItem(), 'beforeend');
render(tripList, createEventItem(), 'beforeend');
render(tripList, createEventItem(), 'beforeend');

const tripItem = siteMainelement.querySelectorAll('.trip-events__item');

render(tripItem[0], createEditPoint(), 'afterbegin');
render(tripItem[1], createEventItemInner(), 'beforeend');
render(tripItem[2], createEventItemInner(), 'beforeend');
render(tripItem[3], createEventItemInner(), 'beforeend');
