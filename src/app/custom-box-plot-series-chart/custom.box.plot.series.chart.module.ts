import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomBoxPlotSeriesChartComponent } from './custom.box.plot.series.chart.component';
import { CustomBoxPlotSeriesChartBoxComponent } from './custom.box.plot.series.chart.box.component';
import { CustomBoxPlotSeriesChartBoxSeriesComponent } from './custom.box.plot.series.chart.box.series.component';

@NgModule({
  declarations: [
    CustomBoxPlotSeriesChartComponent, CustomBoxPlotSeriesChartBoxComponent, CustomBoxPlotSeriesChartBoxSeriesComponent
  ],
  imports: [
    NgxChartsModule
  ],
  exports: [
    CustomBoxPlotSeriesChartComponent, CustomBoxPlotSeriesChartBoxComponent, CustomBoxPlotSeriesChartBoxSeriesComponent
  ],
  providers: []
})
export class CustomBoxPlotSeriesChartModule {
}
