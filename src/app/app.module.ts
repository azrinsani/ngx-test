import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomBarVerticalModule} from "./custom-vertical-bar-chart/custom.bar.vertical.module";
import { CommonModule} from "@angular/common";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { CustomGroupedVerticalBarModule } from "./custom-grouped-vertical-bar-chart/custom.grouped.vertical.bar.module";
import { CustomPolarChartModule } from "./custom-polar-chart/custom.polar.chart.module";
import { CustomBoxPlotSeriesChartModule } from "./custom-box-plot-series-chart/custom.box.plot.series.chart.module";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import {CustomLineChartModule} from "./custom-line-chart/custom.line.chart.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    CustomBarVerticalModule,
    CustomGroupedVerticalBarModule,
    CustomBoxPlotSeriesChartModule,
    CustomLineChartModule,
    CustomPolarChartModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    CommonModule,
    TooltipModule.forRoot(),
    CustomLineChartModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
