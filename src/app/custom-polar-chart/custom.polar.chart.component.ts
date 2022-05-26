import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleLinear, scaleTime, scalePoint, ScaleLinear } from 'd3-scale';
import { curveLinearClosed } from 'd3-shape';
import { calculateViewDimensions } from '@swimlane/ngx-charts';
import { ColorHelper } from '@swimlane/ngx-charts';
import { BaseChartComponent } from '@swimlane/ngx-charts';
import { LegendPosition, isDate, Orientation, ScaleType, getScaleType, CustomChartEmitType, LegendOptionType } from '../../shared/types/custom.chart.type';
import { ViewDimensions } from '@swimlane/ngx-charts';
import { Series } from '@swimlane/ngx-charts/lib/models/chart-data.model';

@Component({
  selector: 'ga-custom-polar-chart',
  templateUrl: './custom.polar.chart.component.html',
  styleUrls: ['custom.polar.chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate(
          500,
          style({
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class CustomPolarChartComponent extends BaseChartComponent {
  @Input() showLegend: boolean = false;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Input() xAxis: boolean;
  @Input() yAxis: boolean;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() showXGridLines: boolean = true;
  @Input() showYGridLines: boolean = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: ScaleType;
  // This is the opacity fill of the enclosed shape
  @Input() rangeFillOpacity: number = 0;
  @Input() trimYAxisTicks: boolean = true;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: (o: any) => any;
  @Input() yAxisTickFormatting: (o: any) => any;
  @Input() roundDomains: boolean = true;
  @Input() tooltipDisabled: boolean = false;
  @Input() showSeriesOnHover: boolean = true;
  @Input() gradient: boolean = false;
  // The max value in the radius circle. Ignored if autoScale is TRUE
  @Input() yAxisMinScale: number = 0;
  // The min value in the radius circle. Ignored if autoScale is TRUE
  @Input() yAxisMaxScale: number = 100;
  // autoScale needs to be false if yAxisMinScale and yAxisMaxScale is set
  @Input() autoScale: boolean = true;
  @Input() labelTrim: boolean = true;
  @Input() labelTrimSize: number = 10;
  @Input() margin: number[] = [0, 20, 10, 20];
  // The label position can be vertically aligned on the sides or around the circle.
  @Input() labelPositionOnSides: boolean = false;
  @Input() yAxisTicksInCentre: boolean = false;
  @Output() activate: EventEmitter<CustomChartEmitType> = new EventEmitter();
  @Output() deactivate: EventEmitter<CustomChartEmitType> = new EventEmitter();
  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  yAxisDims: ViewDimensions;
  labelOffset: number;
  xDomain: any;
  yDomain: any;
  seriesDomain: any;
  yScale: (domain: any[], height: number) => any;
  xScale: (domain: any[], width: number) => any;
  yAxisScale: any;
  colors: ColorHelper;
  scaleType: ScaleType;
  transform: string;
  transformPlot: string;
  transformYAxis: string;
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  yAxisOffset: number = 0;
  filteredDomain: any;
  legendOptions: any;
  thetaTicks: any[];
  radiusTicks: number[];
  outerRadius: number;
  orientation: string = Orientation.Bottom;
  curve: any = curveLinearClosed;

  // Update and refreshes the chart
  update(): void {
    super.update();
    this.setDims();
    this.setScales();
    this.setColors();
    this.legendOptions = this.getLegendOptions();
    this.setTicks();
  }

  // Set the chart dimensions for display
  setDims(): void {
    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.showLegend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });
    const halfWidth: number = Math.floor(this.dims.width / 2);
    const halfHeight: number = Math.floor(this.dims.height / 2);
    const additionalVerticalSpaceRatio: number = this.labelPositionOnSides ? 1.5 : 1.2;
    const outerRadius: number = (this.outerRadius = Math.min(halfHeight / additionalVerticalSpaceRatio, halfWidth / additionalVerticalSpaceRatio));
    const yOffset: number = Math.max(0, halfHeight - outerRadius);
    this.yAxisDims = {
      ...this.dims,
      width: halfWidth
    };
    const xOffset: number = this.yAxisTicksInCentre ? 0 : this.dims.xOffset;
    this.transform = `translate(${xOffset}, ${this.margin[0]})`;
    this.transformYAxis = `translate(0, ${yOffset})`;
    this.labelOffset = this.dims.height + 40;
    this.transformPlot = `translate(${halfWidth}, ${halfHeight})`;
  }

  // Set the scales based on polar angles
  setScales(): void {
    const xValues: any[] = this.getXValues();
    this.scaleType = getScaleType(xValues);
    this.xDomain = this.filteredDomain || this.getXDomain(xValues);
    this.yDomain = this.getYDomain();
    this.seriesDomain = this.getSeriesDomain();
    this.xScale = this.getXScale(this.xDomain, 2 * Math.PI);
    this.yScale = this.getYScale(this.yDomain, this.outerRadius);
    this.yAxisScale = this.getYScale(this.yDomain.reverse(), this.outerRadius);
  }

  // Set the chart ticks location
  setTicks(): void {
    let tickFormat: (o: any) => any;
    if (this.xAxisTickFormatting) {
      tickFormat = this.xAxisTickFormatting;
    } else {
      tickFormat = (dataValue): string => {
        if (isDate(dataValue)) {
          return dataValue.toLocaleDateString();
        }
        return dataValue.toLocaleString();
      };
    }
    const outerRadius: number = this.outerRadius + 20;
    this.thetaTicks = this.xDomain.map(dataValue => {
      const startAngle: number = this.xScale(dataValue, 2 * Math.PI);
      const dataPositionOnInRadius: number = 1.1 * outerRadius * (startAngle > Math.PI ? -1 : 1);
      const label: number = tickFormat(dataValue);
      const startPosition: [number, number] = [outerRadius * Math.sin(startAngle), -outerRadius * Math.cos(startAngle)];
      const position: [number, number] = this.labelPositionOnSides ? [dataPositionOnInRadius, 1.1 * startPosition[1]] : [startPosition[0], 1 * startPosition[1]];
      return {
        innerRadius: 0,
        outerRadius,
        startAngle,
        endAngle: startAngle,
        value: outerRadius,
        label,
        startPos: startPosition,
        pos: position
      };
    });
    const minDistance: number = 10;

    // Space overlapped ticks when labels are on sides
    if (this.labelPositionOnSides) {
      for (let i: number = 0; i < this.thetaTicks.length - 1; i++) {
        for (let j: number = i + 1; j < this.thetaTicks.length; j++) {
          // if they're on the same side
          if (this.thetaTicks[j].pos[0] * this.thetaTicks[i].pos[0] > 0) {
            // if they're overlapping
            const distance: number = minDistance - Math.abs(this.thetaTicks[j].pos[1] - this.thetaTicks[i].pos[1]);
            if (distance > 0) {
              this.thetaTicks[j].pos[1] += Math.sign(this.thetaTicks[j].pos[0]) * distance;
            }
          }
        }
      }
    }
    if (this.yAxisTicksInCentre) {
      this.showYGridLines = false;
      const halfWidth: number = Math.floor(this.dims.width / 2);
      this.yAxisOffset = -1 * halfWidth - 10;
      this.margin = [0,0,0,0];
    }
    this.radiusTicks = this.yAxisScale.ticks(Math.floor(this.dims.height / 50)).map(d => this.yScale(d, this.outerRadius));
  }

  // Get the X Chart Data Values
  getXValues(): any[] {
    const values: any[] = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (!values.includes(d.name)) {
          values.push(d.name);
        }
      }
    }
    return values;
  }

  // Get the domain (range) of the X Values
  getXDomain(values: any[] = this.getXValues()): any[] {
    if (this.scaleType === ScaleType.Time) {
      const min: number = Math.min(...values);
      const max: number = Math.max(...values);
      return [min, max];
    } else if (this.scaleType === ScaleType.Linear) {
      values = values.map(v => Number(v));
      const min: number = Math.min(...values);
      const max: number = Math.max(...values);
      return [min, max];
    }
    return values;
  }

  // Get the X Chart Data Values
  getYValues(): any[] {
    const domain: any[] = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
        if (d.min !== undefined) {
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }
    return domain;
  }

  // Get the domain (range) of the Y Values
  getYDomain(domain: any[] = this.getYValues()): any[] {
    let min: number = this.yAxisMinScale;
    let max: number = this.yAxisMaxScale;
    if (this.autoScale) {
      min = Math.min(...domain);
      max = Math.max(...domain);
    }
    return [min, max];
  }

  // Get the series names
  getSeriesDomain(): any[] {
    return this.results.map(d => d.name);
  }

  // Get the scale for X data
  getXScale(domain: any[], width: number): any {
    switch (this.scaleType) {
      case ScaleType.Time:
        return scaleTime().range([0, width]).domain(domain);
      case ScaleType.Linear: {
        const scale: ScaleLinear<number, number> = scaleLinear().range([0, width]).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
      }
      default:
        return scalePoint()
          .range([0, width - 2 * Math.PI / domain.length])
          .padding(0)
          .domain(domain);
    }
  }

  // Get the scale for Y data
  getYScale(domain: any[], height: number): any {
    const scale: any = scaleLinear().range([0, height]).domain(domain);
    return this.roundDomains ? scale.nice() : scale;
  }

  // When a user clicks on a point
  onClick(data: Series, series?: any): void {
    if (series) {
      data.series = series.name;
    }
    this.select.emit(data);
  }

  // Set the colors for the chart
  setColors(): void {
    const domain: any = this.schemeType === ScaleType.Ordinal ? this.seriesDomain : this.yDomain.reverse();
    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  // Get the options for the legend to be displayed
  getLegendOptions(): LegendOptionType {
    if (this.schemeType === ScaleType.Ordinal) {
      return {
        scaleType: this.schemeType,
        colors: this.colors,
        domain: this.seriesDomain,
        title: this.legendTitle,
        position: this.legendPosition
      };
    }
    return {
      scaleType: this.schemeType,
      colors: this.colors.scale,
      domain: this.yDomain,
      title: undefined,
      position: this.legendPosition
    };
  }

  // Redraws the Y Axis based on new width
  updateYAxisWidth({ width }: { width: number }): void {
    this.yAxisWidth = width;
    this.update();
  }

  // Redraws the X Axis based on new width
  updateXAxisHeight({ height }: { height: number }): void {
    this.xAxisHeight = height;
    this.update();
  }

  // When mouse hovers over a data point
  onActivate(item: any): void {
    const idx: number = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });
    if (idx > -1) {
      return;
    }
    this.activeEntries = this.showSeriesOnHover ? [item, ...this.activeEntries] : this.activeEntries;
    this.activate.emit(<CustomChartEmitType>{ value: item, entries: this.activeEntries });
  }

  // When mouse leaves the hovering over a data point
  onDeactivate(item: any): void {
    const idx: number = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });
    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];
    this.deactivate.emit(<CustomChartEmitType>{ value: item, entries: this.activeEntries });
  }

  // Deactivate all selected data points
  deactivateAll(): void {
    this.activeEntries = [...this.activeEntries];
    for (const entry of this.activeEntries) {
      this.deactivate.emit({ value: entry, entries: [] });
    }
    this.activeEntries = [];
  }

  // An ID for each series for tracking
  trackBy(index: number, item: any): string {
    return `${item.name}`;
  }
}
