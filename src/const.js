import dayjs from 'dayjs';
export const SortType = {
  Day: 'day',
  Duration: 'duration',
  Price: 'price',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const BLANK_POINT = {
  type: 'bus',
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  offers: [],
  destination: {},
  isFavotite: false,
};

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

export const AUTHORIZATION = 'Basic GhtU4AvU4anfZL6';
