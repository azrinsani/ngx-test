import { Component } from '@angular/core';
import {barChartData, lineChartData} from "./app.data";
import { LegendPosition } from './custom-grouped-vertical-bar-chart/custom.grouped.vertical.bar.type';
import {MultiSeries} from "@swimlane/ngx-charts/lib/models/chart-data.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngtest';
  //dualChartData: MultiSeries[] = [barChartData, lineChartData];
  dualChartData: MultiSeries = barChartData;
  legendPosition = LegendPosition.Right;
  yScaleMax: number;
  constructor() {
  }

  onDataItemClick(item) {
    console.log(item);
  }

}
