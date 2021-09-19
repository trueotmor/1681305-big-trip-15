import dayjs from 'dayjs';
import { FilterType } from '../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) =>
    points.filter((point) => point.dateFrom >= dayjs().toDate() || (point.dateFrom < dayjs().toDate() && point.dateTo > dayjs().toDate())),
  [FilterType.PAST]: (points) =>
    points.filter((point) => point.dateTo < dayjs().toDate() || (point.dateFrom < dayjs().toDate() && point.dateTo > dayjs().toDate())),
};
