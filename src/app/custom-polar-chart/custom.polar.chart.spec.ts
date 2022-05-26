import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomPolarChartComponent } from "./custom.polar.chart.component";
import { NgxChartsModule, PolarChartComponent } from "@swimlane/ngx-charts";
import { MultiSeries } from "@swimlane/ngx-charts/lib/models/chart-data.model";
import { customPolarChartMock } from "./custom.polar.chart.mock";

@Component({
  template: `
    <div>
      <ga-custom-polar-chart
        [view]="[750,750]"
        [results]="polarChartData"
        [animations]="false"
        [showLegend]="false"
        [gradient]="false"
        [xAxis]="true"
        [yAxis]="true"
        [showXAxisLabel]="false"
        [showYAxisLabel]="false"
        [showGridLines]="true"
        [rangeFillOpacity]="0"
        [roundDomains]="true"
        [tooltipDisabled]="false"
        [showSeriesOnHover]="false"
        [trimYAxisTicks]="true"
        [maxYAxisTickLength]="16"
        [yAxisMinScale]="-4"
        [yAxisMaxScale]="6"
        [autoScale]="false">
      </ga-custom-polar-chart>
    </div>
  `
})
class PolarChartTestComponent {
  polarChartData: MultiSeries = customPolarChartMock;
}

describe('CustomPolarChartComponent', () => {
  let fixture: ComponentFixture<PolarChartTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomPolarChartComponent,
        PolarChartTestComponent
      ],
      imports: [
        BrowserAnimationsModule,
        NoopAnimationsModule,
        NgxChartsModule
      ],
      providers: [
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(PolarChartTestComponent);
     });
  }));

  it('can instantiate', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).not.toBeNull();
    const yAxisElement = fixture.debugElement.query(By.css('.polar-chart-y-axis')).nativeElement;
    expect(yAxisElement).toBeTruthy();
  });
});
