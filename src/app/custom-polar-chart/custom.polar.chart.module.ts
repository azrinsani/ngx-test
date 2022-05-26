import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomPolarChartComponent } from './custom.polar.chart.component';

@NgModule({
  declarations: [
    CustomPolarChartComponent
  ],
  imports: [
    NgxChartsModule
  ],
  exports: [
    CustomPolarChartComponent
  ],
  providers: []
})
export class CustomPolarChartModule {
}
