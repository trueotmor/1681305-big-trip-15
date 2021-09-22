import AbstractView from '../abstract.js';

const createOffersContainerTemplate = (offersList, selectedOffers) => {
  const createOfferTemplate = (offer = {}, id) => {
    const isChecked = selectedOffers.map((offerItem) => offerItem.title).includes(offer.title) ? 'checked' : '';
    const title = offer.title ? offer.title : '';
    const price = offer.price ? offer.price : 0;

    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${id}" ${isChecked}>
              <label class="event__offer-label" for="${id}">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>`;
  };
  const availableOffers = offersList.length ? offersList.map((offer) => createOfferTemplate(offer, offer.title)).join('') : '';
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
            ${availableOffers}
            </div>
          </section>`;
};

export default class PointOffersView extends AbstractView {
  constructor(offersList, offers) {
    super();
    this._offersList = offersList;
    this._selectedOffers = offers;
  }

  getTemplate() {
    return createOffersContainerTemplate(this._offersList, this._selectedOffers);
  }
}
