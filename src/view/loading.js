import AbstractView from './abstract.js';

const createNoPointsTemplate = () =>
  `<p class="board__no-tasks">
    Loading...
  </p>`;

export default class TripLoadingView extends AbstractView {
  getTemplate() {
    return createNoPointsTemplate();
  }
}
