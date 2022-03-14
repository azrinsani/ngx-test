import { Component } from '@angular/core';
import {tonnageChartData, gradeChartData} from "./app.data";
import { LegendPosition } from './custom-grouped-vertical-bar-chart/custom.grouped.vertical.bar.type';
import {MultiSeries} from "@swimlane/ngx-charts/lib/models/chart-data.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngtest';
  data1: MultiSeries = tonnageChartData;
  data2: MultiSeries = gradeChartData;
  legendPosition = LegendPosition.Right;
  constructor() {
  }
}
