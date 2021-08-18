import AbstractView from '../abstract';
import TripEventView from './trip-event.js';
import TripPointFormView from '../trip-point-form/trip-point-form';
import { render } from '../../utils/utils';
import { createElement } from '../../utils/utils';

const createEventList = () => '<ul class="trip-events__list"></ul>';

export default class TripEventList extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createEventList(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      for (const point of this._points) {
        render(this._element, this.renderEvent(point));
      }
    }

    return this._element;
  }

  renderEvent(point) {
    const liElement = createElement('<li class="trip-events__item"></li>');
    const tripEvent = new TripEventView(point);
    render(liElement, tripEvent.getElement());

    liElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
      liElement.replaceWith(this.renderForm(point));
    });

    return liElement;
  }

  renderForm(point) {
    const liElement = createElement('<li class="trip-events__item"></li>');
    const tripForm = new TripPointFormView(point);
    render(liElement, tripForm.getElement());
    liElement.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      liElement.replaceWith(this.renderEvent(point));
      // document.removeEventListener('keydown', onEscKeyDown);
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        liElement.replaceWith(this.renderEvent(point));
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    document.addEventListener('keydown', onEscKeyDown);

    return liElement;
  }
}
