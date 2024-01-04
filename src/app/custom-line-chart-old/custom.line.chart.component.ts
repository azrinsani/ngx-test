import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, HostListener, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { scaleLinear, scaleLog, scalePoint, scaleTime } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, getUniqueXDomainValues, id, ViewDimensions } from '@swimlane/ngx-charts';
import {MultiSeries} from "@swimlane/ngx-charts/lib/models/chart-data.model";

@Component({
  selector: 'ga-ngx-charts-line-chart-old',
  templateUrl: './custom.line.chart.component.html',
  styleUrls: ['./custom.line.chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1,
        }),
        animate(500, style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class CustomLineChartComponent extends BaseChartComponent {
  @Input() data: MultiSeries = []; // The Actual Data that will draw the plot
  @Input() legend: boolean;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: string = 'right';
  @Input() xAxis: boolean;
  @Input() yAxis: boolean;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() autoScale: boolean;
  @Input() timeline: boolean;
  @Input() gradient: boolean;
  @Input() showGridLines: boolean = true;
  @Input() curve: any = curveLinear;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: string;
  @Input() rangeFillOpacity: number;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() rotateXAxisTicks: boolean = true;
  @Input() roundDomains: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() showRefLines: boolean = false;
  @Input() referenceLines: any;
  @Input() showRefLabels: boolean = true;
  @Input() xScaleType: string;
  @Input() xScaleMin: number;
  @Input() xScaleMax: number;
  @Input() yScaleMin: number;
  @Input() yScaleMax: number;
  @Input() yScaleMinInitial: number;
  @Input() yScaleMaxInitial: number;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate', { static: true }) tooltipTemplate: TemplateRef<any>;
  @ContentChild('seriesTooltipTemplate', { static: true }) seriesTooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  xSet: any;
  xDomain: any;
  yDomain: any;
  seriesDomain: any;
  yScale: any;
  xScale: any;
  colors: ColorHelper;
  transform: string;
  clipPath: string;
  clipPathId: string;
  series: any;
  areaPath: any;
  margin: number[] = [10, 20, 10, 20];
  hoveredVertical: any; // The value of the x-axis that is hovered over
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  filteredDomain: any;
  legendOptions: any;
  hasRange: boolean; // Whether the line has a min-max range around it
  timelineWidth: any;
  timelineHeight: number = 50;
  timelineXScale: any;
  timelineYScale: any;
  timelineXDomain: any;
  timelineTransform: any;
  timelinePadding: number = 10;
  xAxisTickDecimals: number;

  update(): void {

    console.log(this.results);
    super.update();

    if (this.xAxisTickDecimals === undefined) {
      if (this.xAxisTicks !== undefined) {
        this.xAxisTickDecimals = this.countDecimals(this.xAxisTicks[0]);
        this.xAxisTicks.forEach((tick) => {
          if (this.countDecimals(tick) > this.xAxisTickDecimals) {
            this.xAxisTickDecimals = this.countDecimals(tick);
          }
        });
      }
    }

    if (!this.xAxisTickFormatting) {
      this.xAxisTickFormatting = (val): number => {
        if (this.xAxisTickDecimals !== undefined) {
          if (this.countDecimals(val) > this.xAxisTickDecimals) {
            return val.toFixed(this.xAxisTickDecimals);
          }
        }
        return val;
      };
    }

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
      showLegend: this.legend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });

    if (this.timeline) {
      this.dims.height -= (this.timelineHeight + this.margin[2] + this.timelinePadding);
    }

    this.xDomain = this.getXDomain();
    if (this.filteredDomain) {
      this.xDomain = this.filteredDomain;
    }

    this.yDomain = this.getYDomain();
    this.seriesDomain = this.getSeriesDomain();

    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);

    this.updateTimeline();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

    this.clipPathId = 'clip' + id().toString();
    this.clipPath = `url(#${this.clipPathId})`;
  }

  countDecimals(value: number): number {
    if ((value % 1) !== 0) {
      return value.toString().split('.')[1].length;
    }
    return 0;
  }

  updateTimeline(): void {
    if (this.timeline) {
      this.timelineWidth = this.dims.width;
      this.timelineXDomain = this.getXDomain();
      this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
      this.timelineYScale = this.getYScale(this.yDomain, this.timelineHeight);
      this.timelineTransform = `translate(${this.dims.xOffset}, ${-this.margin[2]})`;
    }
  }

  getXDomain(): any[] {
    let values: any[] = getUniqueXDomainValues(this.results);
    this.xScaleType = this.getXScaleType(values);
    let domain: any[] = [];

    if (this.xScaleType === 'linear' || this.xScaleType === 'log') {
      values = values.map(v => Number(v));
    }

    let min: number;
    let max: number;
    if (this.xScaleType === 'time' || this.xScaleType === 'linear' || this.xScaleType === 'log') {
      min = this.hasValue(this.xScaleMin)
        ? this.xScaleMin
        : Math.min(...values);

      max = this.hasValue(this.xScaleMax)
        ? this.xScaleMax
        : Math.max(...values);
    }

    if (this.xScaleType === 'time') {
      domain = [new Date(min), new Date(max)];
      this.xSet = [...values].sort((a, b) => {
        const aDate: number = a.getTime();
        const bDate: number = b.getTime();
        return aDate - bDate;
      });
    } else if (this.xScaleType === 'linear' || this.xScaleType === 'log') {
      domain = [min, max];
      this.xSet = this.results[0].series.map((obj) => obj.name); // Custom function, dataset should already be sorted
    } else {
      domain = values;
      this.xSet = values;
    }

    for (const results of this.results) {
      for (const d of results.series) {
        if (d.min !== undefined) {
          this.hasRange = true;
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          this.hasRange = true;
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }

    return domain;
  }

  getYDomain(): any[] {
    const domain: any[] = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
      }
    }

    const values: any[] = [...domain];
    if (!this.autoScale) {
      values.push(0);
    }

    const min: number = this.hasValue(this.yScaleMin)
      ? this.yScaleMin
      : Math.min(...values);

    const max: number = this.hasValue(this.yScaleMax)
      ? this.yScaleMax
      : Math.max(...values);

    return [min, max];
  }

  getSeriesDomain(): any[] {
    return this.results.map(d => d.name);
  }

  getXScale(domain: any[], width: number): any {
    let scale: any;

    switch (this.xScaleType) {
      case 'linear':
        scale = scaleLinear()
          .range([0, width])
          .domain(domain);

        if (this.roundDomains) {
          scale = scale.nice();
        }
        break;
      case 'log':
        scale = scaleLog()
          .range([0, width])
          .domain(domain);

        if (this.roundDomains) {
          scale = scale.nice();
        }
        break;
      case 'ordinal':
        scale = scalePoint()
          .range([0, width])
          .padding(0.1)
          .domain(domain);
        break;
      case 'time':
        scale = scaleTime()
          .range([0, width])
          .domain(domain);
        break;
    }

    return scale;
  }

  getYScale(domain: any[], height: number): any {
    const scale: any = scaleLinear()
      .range([height, 0])
      .domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  getXScaleType(values: any[]): string {
    if (this.xScaleType) {
      return this.xScaleType;
    }

    // If scale type not specified, set based on the data.
    let date: boolean = true;
    let num: boolean = true;

    for (const value of values) {
      if (!this.isDate(value)) {
        date = false;
      }

      if (typeof value !== 'number') {
        num = false;
      }
    }

    if (date) {
      return 'time';
    }
    if (num) {
      return 'linear';
    }
    return 'ordinal';
  }

  isDate(value: any): boolean {
    if (value instanceof Date) {
      return true;
    }

    return false;
  }

  // Number cannot be checked with falsy statement since 0 value will be falsy
  hasValue(value: number): boolean {
    return value !== null && value !== undefined;
  }

  updateDomain(domain: any[]): void {
    this.filteredDomain = domain;
    this.xDomain = this.filteredDomain;
    this.xScale = this.getXScale(this.xDomain, this.dims.width);
  }

  updateHoveredVertical(item: any): void {
    this.hoveredVertical = item.value;
    this.deactivateAll();
  }

  @HostListener('mouseleave')
  hideCircles(): void {
    this.hoveredVertical = null;
    this.deactivateAll();
  }

  onClick(data: any, series?: any): void {
    if (series) {
      data.series = series.name;
    }

    this.select.emit(data);
  }

  trackBy(index: number, item: any): string {
    return item.name;
  }

  setColors(): void {
    let domain: any[];
    if (this.schemeType === 'ordinal') {
      domain = this.seriesDomain;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions(): any {
    const opts: any = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === 'ordinal') {
      opts.domain = this.seriesDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.yDomain;
      opts.colors = this.colors.scale;
    }
    return opts;
  }

  updateYAxisWidth({ width }: any): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }: any): void {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(item: any): void {
    this.deactivateAll();

    const idx: number = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item: any): void {
    const idx: number = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

  deactivateAll(): void {
    this.activeEntries = [...this.activeEntries];
    for (const entry of this.activeEntries) {
      this.deactivate.emit({ value: entry, entries: [] });
    }
    this.activeEntries = [];
  }
}
