import {MultiSeries } from "@swimlane/ngx-charts/lib/models/chart-data.model";


export const gradeChartData: MultiSeries = [
  {
    name: "Indicated resource",
    series: [
      {
        name: "Silver Grade",
        value: 5,
      },
      {
        name: "Lead Grade",
        value: 7
      },
      {
        name: "Zinc Grade",
        value: 9
      }
    ]
  },
  {
    name: "Inferred resource",
    series: [
      {
        name: "Silver Grade",
        value: 2
      },
      {
        name: "Lead Grade",
        value: 9
      },
      {
        name: "Zinc Grade",
        value: 3
      }
    ]
  },
  {
    name: "Measured resource",
    series: [
      {
        name: "Silver Grade",
        value: 5
      },
      {
        name: "Lead Grade",
        value: 2.5
      },
      {
        name: "Zinc Grade",
        value: 4
      }
    ]
  },
  {
    name: "Probable (ore) reserve",
    series: [
      {
        name: "Silver Grade",
        value: 1
      },
      {
        name: "Lead Grade",
        value: 2
      },
      {
        name: "Zinc Grade",
        value: 3
      }
    ]
  },
  {
    name: "Proved (ore) reserve",
    series: [
      {
        name: "Silver Grade",
        value: 4
      },
      {
        name: "Lead Grade",
        value: 5
      },
      {
        name: "Zinc Grade",
        value: 5
      }
    ]
  }
];


export const tonnageChartData : MultiSeries = [
  {
    name: "Indicated resource",
    series: [
      {
        name: "Silver",
        value: 40,
        "extra": {
          "code": "de"
        }
      },
      {
        name: "Lead",
        value: 36,
        "extra": {
          "code": "de"
        }
      },
      {
        name: "Zinc",
        value: 31,
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
        value: 0,
        "extra": {
          "code": "us"
        }
      },
      {
        name: "Lead",
        value: 45,
        "extra": {
          "code": "us"
        }
      },
      {
        name: "Zinc",
        value: 37,
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
        value: 36,
        "extra": {
          "code": "fr"
        }
      },
      {
        name: "Lead",
        value: 34,
        "extra": {
          "code": "fr"
        }
      },
      {
        name: "Zinc",
        value: 29,
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
        value: 36,
        "extra": {
          "code": "uk"
        }
      },
      {
        name: "Lead",
        value: 32,
        "extra": {
          "code": "uk"
        }
      },
      {
        name: "Zinc",
        value: 26,
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
        value: 36,
        "extra": {
          "code": "uk"
        }
      },
      {
        name: "Lead",
        value: 32,
        "extra": {
          "code": "uk"
        }
      },
      {
        name: "Zinc",
        value: 26,
        "extra": {
          "code": "uk"
        }
      }
    ]
  }
]
