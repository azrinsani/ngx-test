import {Component} from '@angular/core';
import {
  boxPlotDataJsonStr,
  depositClimateDataJsonStr,
  gradeChartDataLog,
  polarChartDataMock,
  tonnageChartData,
  tonnageTimeSeriesData
} from "./app.data";
import {
  LegendPosition,
  SelectableUnitType,
  YAxisLabelType
} from './custom-grouped-vertical-bar-chart/custom.grouped.vertical.bar.type';
import {DataItem, MultiSeries, Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {
  DepositSummaryGeochemistryFeaturePropertiesType,
  DepositSummaryWfsType
} from "./geochemistry/deposit.summary.report.type";
import {
  BoxPlotSeriesType,
  DepositClimateChartDataType,
  DepositClimateDataType,
  ScaleType
} from 'src/shared/types/custom.chart.type';
import {setTheme} from "ngx-bootstrap/utils";
import {depositClimateChartConfig} from "./deposit.climate.config";

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
  timeChartData: MultiSeries = tonnageTimeSeriesData;
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
  climateData: DepositClimateDataType;
  climateChartData: DepositClimateChartDataType;
  boxData: BoxPlotSeriesType[];
  yAxisTickFormattingFunc: (any) => string;
  selectableUnits: SelectableUnitType[] = [
    { name: 't', converterFunction: e => e },
    { name: 'Kt', converterFunction: e => e / 1000 },
    { name: 'Mt', converterFunction: e => e / 1000000 },
    { name: 'Gt', converterFunction: e => e / 1000000000 },
  ]
  selectedUnitName: string;
  yAxisLabel: YAxisLabelType;

  constructor() {
    setTheme('bs3');
    this.selectedUnitName = this.selectableUnits[0].name;
    this.yAxisLabel = "Tonnage (" + this.selectedUnitName + ")";
    this.boxData = JSON.parse(boxPlotDataJsonStr);
    this.climateData = JSON.parse(depositClimateDataJsonStr);
    console.log(this.climateData);
    this.climateChartData = <DepositClimateChartDataType> {
      name: depositClimateChartConfig.find(config => config.climateProperty === Number(this.climateData.property) && config.provider === this.climateData.provider).name,
      series: Object.keys(this.climateData.values).map(key => ({
        name: new Date(key),
        value: this.climateData.values[key]
      }))
    }
    console.log(this.boxData);
    console.log(this.climateChartData);
    this.yAxisLabel = (selectableUnit: SelectableUnitType) => "Tonnage (" + selectableUnit.name + ")";
    this.yAxisTickFormattingFunc = (a) => {
      return a
    }
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

  // Formats the axis ticks to include carbon name
  getXAxisTickFormat = (xAxisValue: number): string => {
    return new Date(xAxisValue).toLocaleDateString();
  };

  getLocalDateString(xAxisValue: number): string {
    return new Date(xAxisValue).toLocaleDateString();
  }
}

