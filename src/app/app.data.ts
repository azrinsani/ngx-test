import {MultiSeries, SingleSeries} from "@swimlane/ngx-charts/lib/models/chart-data.model";


export const lineChartData: MultiSeries = [
  {
    name: 'Silver Grade',
    series: [
      {
        name: 'Indicated resource',
        value: 50
      },
      {
        value: 80,
        name: 'Inferred resource'
      },
      {
        value: 85,
        name: 'Measured resource'
      },
      {
        value: 90,
        name: 'Probable (ore) reserve'
      },
      {
        value: 100,
        name: 'Proved (ore) reserve'
      }
    ]
  },
  {
    name: 'Lead Grade',
    series: [
      {
        value: 10,
        name: 'Indicated resource'
      },
      {
        value: 20,
        name: 'Inferred resource'
      },
      {
        value: 30,
        name: 'Measured resource'
      },
      {
        value: 40,
        name: 'Probable (ore) reserve'
      },
      {
        value: 10,
        name: 'Proved (ore) reserve'
      }
    ]
  },
  {
    name: 'Zinc Grade',
    series: [
      {
        value: 2,
        name: 'Indicated resource'
      },
      {
        value: 4,
        name: 'Inferred resource'
      },
      {
        value: 20,
        name: 'Measured resource'
      },
      {
        value: 30,
        name: 'Probable (ore) reserve'
      },
      {
        value: 35,
        name: 'Proved (ore) reserve'
      }
    ]
  }
];


export const barChartData : MultiSeries = [
  {
    name: "Indicated resource",
    series: [
      {
        name: "Silver",
        value: 40632,
        "extra": {
          "code": "de"
        }
      },
      {
        name: "Lead",
        value: 36953,
        "extra": {
          "code": "de"
        }
      },
      {
        name: "Zinc",
        value: 31476,
        "extra": {
          "code": "de"
        }
      }
    ]
  },
  {
    name: "Inferred resource",
    series: [
      {
        name: "Silver",
        value: 330,
        "extra": {
          "code": "us"
        }
      },
      {
        name: "Lead",
        value: 45986,
        "extra": {
          "code": "us"
        }
      },
      {
        name: "Zinc",
        value: 37060,
        "extra": {
          "code": "us"
        }
      }
    ]
  },
  {
    name: "Measured resource",
    series: [
      {
        name: "Silver",
        value: 36745,
        "extra": {
          "code": "fr"
        }
      },
      {
        name: "Lead",
        value: 34774,
        "extra": {
          "code": "fr"
        }
      },
      {
        name: "Zinc",
        value: 29476,
        "extra": {
          "code": "fr"
        }
      }
    ]
  },
  {
    name: "Probable (ore) reserve",
    series: [
      {
        name: "Silver",
        value: 36240,
        "extra": {
          "code": "uk"
        }
      },
      {
        name: "Lead",
        value: 32543,
        "extra": {
          "code": "uk"
        }
      },
      {
        name: "Zinc",
        value: 26424,
        "extra": {
          "code": "uk"
        }
      }
    ]
  },
  {
    name: "Proved (ore) reserve",
    series: [
      {
        name: "Silver",
        value: 36240,
        "extra": {
          "code": "uk"
        }
      },
      {
        name: "Lead",
        value: 32543,
        "extra": {
          "code": "uk"
        }
      },
      {
        name: "Zinc",
        value: 26424,
        "extra": {
          "code": "uk"
        }
      }
    ]
  }
]
