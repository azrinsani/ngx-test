import { Component } from '@angular/core';
import {
  tonnageChartData,
  gradeChartData,
  polarChartDataMock,
  boxPlotDataJsonStr,
  tonnageChartDataLog, gradeChartDataLog
} from "./app.data";
import { LegendPosition } from './custom-grouped-vertical-bar-chart/custom.grouped.vertical.bar.type';
import { DataItem, MultiSeries, Series } from "@swimlane/ngx-charts/lib/models/chart-data.model";
import { DepositSummaryGeochemistryFeaturePropertiesType, DepositSummaryWfsType } from "./geochemistry/deposit.summary.report.type";
import { property } from "lodash-es";
import { mockDepositGeochemistryJson } from "./geochemistry/deposit.geochemistry.mock";
import { BoxPlotSeriesType, ScaleType } from 'src/shared/types/custom.chart.type';
import {setTheme} from "ngx-bootstrap/utils";
import {Select} from "ol/interaction";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngtest';
  data1: MultiSeries = tonnageChartData;
  data2: MultiSeries = gradeChartDataLog;
  polarChartData: MultiSeries = polarChartDataMock;
  boxPlotData: MultiSeries;
  legendPosition = LegendPosition.Right;
  customColors: any[] = [
    {
      name: 'Germany',
      value: '#a8385d'
    }
  ];
  schemeType = ScaleType.Ordinal;
  colorSets: any;
  colorScheme: any;
  boxData: BoxPlotSeriesType[];

  constructor() {
    setTheme('bs3');
    this.selectedUnitName = this.selectableUnits[0].name;
    this.yAxisLabel = "Tonnage (" + this.selectedUnitName + ")";
    const getFeatureResult: DepositSummaryWfsType = JSON.parse(mockDepositGeochemistryJson);
    this.boxData = JSON.parse(boxPlotDataJsonStr);
    console.log(mockBoxData)
    console.log(this.boxData);
    // this.polarChartData = this.transformToPolarChartData(getFeatureResult);
  }

  // Transform WFS result into Polar Series
  transformToPolarChartData(data: DepositSummaryWfsType): MultiSeries {
    const properties: DepositSummaryGeochemistryFeaturePropertiesType[] = data.features.map(feature => feature.properties as DepositSummaryGeochemistryFeaturePropertiesType);
    let dataItems: DataItem[] = [];
    properties.forEach(property => {
      Object.entries(property).filter(entry=> /_PPM|_PPB/.test(entry[0])).forEach(entry => {
        const existingDataItem: DataItem = dataItems.find(dataItem => dataItem.extra.property === entry[0]);
        if (!existingDataItem) {
          const mineral: string = entry[0].split('_')[0];
          if (!mineral.endsWith('REE')) {
            dataItems.push({
              name: mineral,
              value: 0,
              extra: {
                property: entry[0]
              }
            });
          }
        } else {
          if (entry[1]) {
            const depositAmount: number = entry[1];
            const isInPPB: boolean = existingDataItem.extra.property.endsWith('_PPB');
            if (isInPPB) {
              (existingDataItem.value as number) += depositAmount / 1000;
            } else {
              (existingDataItem.value as number) += depositAmount;
            }
          }
        }
      });
    });
    //Change to Log Scale
    dataItems.sort((a,b) => a.name > b.name ? -1 : 0);
    dataItems = dataItems.filter(dataItem => dataItem.value > 0);
    dataItems.forEach(dataItem => {
      dataItem.value = Math.log10(dataItem.value as number);
    });
    const result: MultiSeries = <Series[]>[
      <Series>{
        name: 'Deposit',
        series: dataItems
      }
    ];
    console.log(result);
    return result;
  }

  select(data) {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  activate(data) {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  deactivate(data) {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }
}

export const mockBoxData: BoxPlotSeriesType[] = [
  {
    name: 'Colombia',
    series: [
      {
        name: '2019',
        value: 12
      },
      {
        name: '2020',
        value: 23
      },
      {
        name: '2021',
        value: 34
      },
      {
        name: '2022',
        value: 27
      },
      {
        name: '2023',
        value: 18
      },
      {
        name: '2024',
        value: 45
      }
    ]
  },
  {
    name: 'Chile',
    series: [
      {
        name: '2019',
        value: 20
      },
      {
        name: '2020',
        value: 28
      },
      {
        name: '2021',
        value: 42
      },
      {
        name: '2022',
        value: 39
      },
      {
        name: '2023',
        value: 31
      },
      {
        name: '2024',
        value: 61
      }
    ]
  },
  {
    name: 'Perú',
    series: [
      {
        name: '2019',
        value: 47
      },
      {
        name: '2020',
        value: 62
      },
      {
        name: '2021',
        value: 55
      },
      {
        name: '2022',
        value: 42
      },
      {
        name: '2023',
        value: 49
      },
      {
        name: '2024',
        value: 71
      }
    ]
  }
];
