import AbstractView from './abstract.js';
import { MenuItem } from '../const.js';

const createSiteMenuTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-type="${MenuItem.TABLE}">Table</a>
                <a class="trip-tabs__btn" href="#" data-type="${MenuItem.STATS}">Stats</a>
              </nav>`;

export default class TripSiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.type);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    const item = this.getElement().querySelector(`[data-type=${menuItem}]`);

    Array.from(items).forEach((menuTab) => menuTab.classList.remove('trip-tabs__btn--active'));

    if (item !== null) {
      item.classList.add('trip-tabs__btn--active');
    }
  }
}
