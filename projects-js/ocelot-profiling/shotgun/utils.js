import moment from 'moment';
import { keyBy } from 'lodash';

export const DATE_PRESETS = keyBy(
  [
    {
      getDates: () => ({
        startDate: moment()
          .startOf('day')
          .toDate(),
        endDate: moment()
          .endOf('day')
          .toDate()
      }),
      title: 'Today',
      displayTitle: 'Current Day',
      id: 'today'
    },
    {
      getDates: () => ({
        startDate: moment()
          .subtract(1, 'day')
          .startOf('day')
          .toDate(),
        endDate: moment()
          .subtract(1, 'day')
          .endOf('day')
          .toDate()
      }),
      title: 'Yesterday',
      displayTitle: 'Yesterday',
      id: 'yesterday'
    },
    {
      getDates: () => ({
        startDate: moment()
          .subtract(2, 'day')
          .startOf('day')
          .toDate(),
        endDate: moment()
          .endOf('day')
          .toDate()
      }),
      title: '3 D',
      displayTitle: 'Last 3 Days',
      id: 'last3'
    },
    {
      getDates: () => ({
        startDate: moment()
          .startOf('isoweek')
          .toDate(),
        endDate: moment()
          .endOf('day')
          .toDate()
      }),
      title: 'WTD',
      displayTitle: 'Week to Date',
      id: 'wtd'
    },
    {
      getDates: () => ({
        startDate: moment()
          .subtract(6, 'days')
          .startOf('day')
          .toDate(),
        endDate: moment()
          .endOf('day')
          .toDate()
      }),
      title: '7 D',
      displayTitle: 'Last 7 Days',
      default: true,
      id: 'last7'
    },
    {
      getDates: () => ({
        startDate: moment()
          .subtract(1, 'week')
          .startOf('isoweek')
          .toDate(),
        endDate: moment()
          .subtract(1, 'week')
          .endOf('isoweek')
          .toDate()
      }),
      title: 'PWD',
      displayTitle: 'Last Week',
      id: 'pwd',
      show: false
    },
    {
      getDates: () => ({
        startDate: moment()
          .subtract(13, 'days')
          .startOf('day')
          .toDate(),
        endDate: moment()
          .endOf('day')
          .toDate()
      }),
      title: '14 D',
      displayTitle: 'Last 14 Days',
      default: true,
      id: 'last14',
      show: false
    },
    {
      getDates: () => ({
        startDate: moment()
          .startOf('month')
          .startOf('day')
          .toDate(),
        endDate: moment()
          .endOf('day')
          .toDate()
      }),
      title: 'MTD',
      displayTitle: 'Month to Date',
      id: 'mtd'
    },
    {
      getDates: () => ({
        startDate: moment()
          .subtract(27, 'day')
          .startOf('day')
          .toDate(),
        endDate: moment()
          .endOf('day')
          .toDate()
      }),
      title: '28 D',
      displayTitle: '28 Days',
      id: 'last28'
    },
    {
      getDates: () => ({
        startDate: moment()
          .subtract(1, 'month')
          .startOf('month')
          .startOf('day')
          .toDate(),
        endDate: moment()
          .subtract(1, 'month')
          .endOf('month')
          .toDate()
      }),
      title: 'PMD',
      displayTitle: 'Last Month',
      id: 'pmd',
      show: false
    },
    {
      getDates: () => ({
        startDate: moment()
          .startOf('quarter')
          .startOf('day')
          .toDate(),
        endDate: moment()
          .endOf('month')
          .toDate()
      }),
      title: 'QTD',
      displayTitle: 'Quarter to Date',
      id: 'qtd',
      show: false
    }
  ],
  'id'
);
