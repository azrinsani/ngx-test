import { TestBed, waitForAsync } from '@angular/core/testing';
import { CustomGroupedVerticalBarComponent } from './custom.grouped.vertical.bar.component';
import { Component } from '@angular/core';
import { customGroupedVerticalBarChartMockData } from './custom.grouped.vertical.bar.component.mock';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

@Component({
  selector: 'ga-test-component',
  template: '',
})
class TestComponent {
  data: any = customGroupedVerticalBarChartMockData;
}

describe('CustomGroupedVerticalBarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomGroupedVerticalBarComponent,
        TestComponent
      ],
      imports: [
        NgxChartsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: `
                   <ga-ngx-charts-grouped-vertical-bar
                    [view]="[1000,500]"
                    [data]="data"
                    [animations]="true"
                    [xAxisLabel]= "'Resources and Reserves Categories'"
                    [yAxisLabel]="'Tonnage (MT)'">
                  </ga-ngx-charts-grouped-vertical-bar>`
      }
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const customGroupedVerticalBarComponent: CustomGroupedVerticalBarComponent = fixture.debugElement.componentInstance;
    expect(customGroupedVerticalBarComponent).toBeTruthy();
  });

  it('should create the axes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const chartXAxisLabel = fixture.nativeElement.querySelector('.chart-x-axis > g > g[ngx-charts-axis-label] > text').innerHTML;
    const chartYAxisLabel = fixture.nativeElement.querySelector('.chart-y-axis > g > g[ngx-charts-axis-label] > text').innerHTML;
    expect(chartXAxisLabel.includes('Resources and Reserves Categories')).toBeTrue();
    expect(chartYAxisLabel.includes('Tonnage (MT)')).toBeTrue();
  });

  it('should draw 5 bar groups with 3 child bars each', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const barGroups = fixture.nativeElement.querySelectorAll('.grouped-chart-vertical-bars');
    expect(barGroups.length).toBe(5);
    expect(barGroups[0].childElementCount).toBe(3);
    expect(barGroups[1].childElementCount).toBe(3);
    expect(barGroups[2].childElementCount).toBe(3);
    expect(barGroups[3].childElementCount).toBe(3);
    expect(barGroups[4].childElementCount).toBe(3);
  });

});
