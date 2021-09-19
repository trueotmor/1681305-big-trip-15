import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
    // this._notify = updateType;
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Cant update unexisting point');
    }

    this._points = [...this._points.slice(0, index), update, ...this._points.slice(index + 1)];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [update, ...this._points];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Cant delete unexisting task');
    }

    this._points = [...this._points.slice(0, index), ...this._points.slice(index + 1)];

    this._notify(updateType);
  }

  parsePointToData(point) {
    return Object.assign({}, point);
  }

  parseDataToPoint(data) {
    data = Object.assign({}, data);
    return data;
  }
}
