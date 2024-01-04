import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomLineChartComponent } from './custom.line.chart.component';
import { CustomTooltipAreaComponent } from './custom.tooltip.area.component';
import { CustomLineSeriesComponent } from './custom.line.series.component';
import { CustomCircleSeriesComponent } from './custom.circle.series.component';
import { CustomSummaryChartComponent } from './custom.summary.chart.component';

@NgModule({
  declarations: [
    CustomLineChartComponent,
    CustomLineSeriesComponent,
    CustomTooltipAreaComponent,
    CustomCircleSeriesComponent,
    CustomSummaryChartComponent
  ],
  imports: [
    NgxChartsModule
  ],
  exports: [
    CustomLineChartComponent,
    CustomSummaryChartComponent
  ],
  providers: []
})
export class CustomLineChartModule {
}
