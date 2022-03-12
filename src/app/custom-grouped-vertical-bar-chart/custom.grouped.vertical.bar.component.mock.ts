import {MultiSeries } from '@swimlane/ngx-charts/lib/models/chart-data.model';

export const customGroupedVerticalBarChartMockData: MultiSeries = [
  {
    name: 'Indicated resource',
    series: [
      {
        name: 'Silver Grade',
        value: 5,
      },
      {
        name: 'Lead Grade',
        value: 7
      },
      {
        name: 'Zinc Grade',
        value: 9
      }
    ]
  },
  {
    name: 'Inferred resource',
    series: [
      {
        name: 'Silver Grade',
        value: 2
      },
      {
        name: 'Lead Grade',
        value: 9
      },
      {
        name: 'Zinc Grade',
        value: 3
      }
    ]
  },
  {
    name: 'Measured resource',
    series: [
      {
        name: 'Silver Grade',
        value: 5
      },
      {
        name: 'Lead Grade',
        value: 2.5
      },
      {
        name: 'Zinc Grade',
        value: 4
      }
    ]
  },
  {
    name: 'Probable (ore) reserve',
    series: [
      {
        name: 'Silver Grade',
        value: 1
      },
      {
        name: 'Lead Grade',
        value: 2
      },
      {
        name: 'Zinc Grade',
        value: 3
      }
    ]
  },
  {
    name: 'Proved (ore) reserve',
    series: [
      {
        name: 'Silver Grade',
        value: 4
      },
      {
        name: 'Lead Grade',
        value: 5
      },
      {
        name: 'Zinc Grade',
        value: 5
      }
    ]
  }
];
