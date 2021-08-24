import AbstractView from '../abstract';
import TripEventView from './trip-event.js';
import TripPointFormView from '../trip-point-form/trip-point-form';
import { createElement, render } from '../../utils/render.js';

const createEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventListView extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createEventListTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      for (const point of this._points) {
        render(this._element, this._renderEvent(point));
      }
    }

    return this._element;
  }

  _renderEvent(point) {
    const liElement = createElement('<li class="trip-events__item"></li>');
    const tripEvent = new TripEventView(point);
    render(liElement, tripEvent);

    liElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
      liElement.replaceWith(this._renderForm(point));
    });

    return liElement;
  }

  _renderForm(point) {
    const liElement = createElement('<li class="trip-events__item"></li>');
    const tripForm = new TripPointFormView(point);
    render(liElement, tripForm);
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        liElement.replaceWith(this._renderEvent(point));
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    liElement.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      liElement.replaceWith(this._renderEvent(point));
      document.removeEventListener('keydown', onEscKeyDown);
    });

    liElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
      liElement.replaceWith(this._renderEvent(point));
      document.removeEventListener('keydown', onEscKeyDown);
    });
    document.addEventListener('keydown', onEscKeyDown);

    return liElement;
  }
}
