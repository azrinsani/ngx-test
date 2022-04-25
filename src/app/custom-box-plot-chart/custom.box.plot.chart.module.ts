import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomBoxPlotChartComponent } from './custom.box.plot.chart.component';
import { CustomBubbleSeriesComponent } from './custom.bubble.series.component';

@NgModule({
  declarations: [
    CustomBoxPlotChartComponent,
    CustomBubbleSeriesComponent
  ],
  imports: [
    NgxChartsModule
  ],
  exports: [
    CustomBoxPlotChartComponent
  ],
  providers: []
})
export class CustomBoxPlotChartModule {
}
