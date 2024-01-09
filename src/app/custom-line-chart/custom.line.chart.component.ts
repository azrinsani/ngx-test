import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, HostListener, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { scaleLinear, scaleLog, scalePoint, scaleTime } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, getUniqueXDomainValues, id, ViewDimensions } from '@swimlane/ngx-charts';
import {ArrayUtilsCommon} from "../utils/array/array.utils";
import { cloneDeep } from "lodash-es";

@Component({
  selector: 'ga-ngx-charts-line-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)"
    >
      <svg:defs>
        <svg:clipPath [attr.id]="clipPathId">
          <svg:rect
            [attr.width]="dims.width + 10"
            [attr.height]="dims.height + 10"
            [attr.transform]="'translate(-5, -5)'"
          />
        </svg:clipPath>
      </svg:defs>
      <svg:g [attr.transform]="transform" class="line-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="false"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="16"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="false"
          [maxTickLength]="16"
          [tickFormatting]="yAxisTickFormattingUpdated"
          [ticks]="yAxisTicks"
          [referenceLines]="referenceLines"
          [showRefLines]="showRefLines"
          [showRefLabels]="showRefLabels"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g [attr.clip-path]="clipPath">
          <svg:g *ngFor="let series of results; trackBy:trackBy" [@animationState]="'active'">
            <svg:g
              ga-ngx-charts-line-series
              [xScale]="xScale"
              [yScale]="yScale"
              [colors]="colors"
              [data]="series"
              [activeEntries]="activeEntries"
              [scaleType]="xScaleType"
              [curve]="curve"
              [rangeFillOpacity]="rangeFillOpacity"
              [hasRange]="hasRange"
              [animations]="animations"
            />
          </svg:g>

          <svg:g *ngIf="!tooltipDisabled" (mouseleave)="hideCircles()">
            <svg:g
              ga-ngx-charts-tooltip-area
              [dims]="dims"
              [xSet]="xSet"
              [xScale]="xScale"
              [yScale]="yScale"
              [results]="results"
              [colors]="colors"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="seriesTooltipTemplate"
              (hover)="updateHoveredVertical($event)"
            />

            <svg:g *ngFor="let series of results">
              <svg:g
                ga-ngx-charts-circle-series
                [xScale]="xScale"
                [yScale]="yScale"
                [colors]="colors"
                [data]="series"
                [scaleType]="xScaleType"
                [visibleValue]="hoveredVertical"
                [activeEntries]="activeEntries"
                [tooltipDisabled]="false"
                [tooltipTemplate]="tooltipTemplate"
                (select)="onClick($event, series)"
                (activate)="onActivate($event)"
                (deactivate)="onDeactivate($event)"
              />
            </svg:g>
          </svg:g>

          <svg:g *ngIf="showErrorBars" style="pointer-events: none">
            <svg:g *ngFor="let result of results; trackBy:trackBy" [@animationState]="'active'">
              <svg:g *ngFor="let dataPoint of result.series">
                <!-- Vertical line -->
                <svg:line [attr.x1]="xScale(dataPoint.name)" [attr.y1]="yScale(dataPoint.value - dataPoint.stdev)"
                          [attr.x2]="xScale(dataPoint.name)" [attr.y2]="yScale(dataPoint.value + dataPoint.stdev)"
                          [attr.stroke]="colors.getColor(result.name)" stroke-width="1"/>
                <!-- Top horizontal line -->
                <svg:line [attr.x1]="xScale(dataPoint.name) - 5" [attr.y1]="yScale(dataPoint.value + dataPoint.stdev)"
                          [attr.x2]="xScale(dataPoint.name) + 5" [attr.y2]="yScale(dataPoint.value + dataPoint.stdev)"
                          [attr.stroke]="colors.getColor(result.name)" stroke-width="1"/>
                <!-- Bottom horizontal line -->
                <svg:line [attr.x1]="xScale(dataPoint.name) - 5" [attr.y1]="yScale(dataPoint.value - dataPoint.stdev)"
                          [attr.x2]="xScale(dataPoint.name) + 5" [attr.y2]="yScale(dataPoint.value - dataPoint.stdev)"
                          [attr.stroke]="colors.getColor(result.name)" stroke-width="1"/>
              </svg:g>
            </svg:g>
          </svg:g>
        </svg:g>
      </svg:g>
      <svg:g
        ngx-charts-timeline
        *ngIf="timeline && xScaleType !== 'ordinal'"
        [attr.transform]="timelineTransform"
        [results]="results"
        [view]="[timelineWidth, height]"
        [height]="timelineHeight"
        [scheme]="scheme"
        [customColors]="customColors"
        [scaleType]="xScaleType"
        [legend]="legend"
        (onDomainChange)="updateDomain($event)"
      >
        <svg:g *ngFor="let series of results; trackBy:trackBy">
          <svg:g
            ngx-charts-line-series
            [xScale]="timelineXScale"
            [yScale]="timelineYScale"
            [colors]="colors"
            [data]="series"
            [scaleType]="xScaleType"
            [curve]="curve"
            [hasRange]="hasRange"
            [animations]="animations"
          />
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
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
  @Input() data: CustomLineChartDataType[];
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
  @Input() xAxisTickFormatting: (xValue: any) => string | number;
  @Input() yAxisTickFormatting: (yValue: any) => string | number;
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
  @Input() yScaleType: string;
  @Input() yScaleMin: number;
  @Input() yScaleMax: number;
  @Input() yScaleMinInitial: number;
  @Input() yScaleMaxInitial: number;
  // An error bar is a common graphical element that shows the standard deviation at each value, stdev property must be included in graph data
  @Input() showErrorBars: boolean = false;

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
  hoveredVertical: any; // The value of the x axis that is hovered over
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
  yAxisTickFormattingUpdated: (yValue: any) => number | string;

  update(): void {
    super.update();
    this.updateDataSet();

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

    if (this.yScaleType === 'log') {
      this.yAxisTickFormattingUpdated = (val): number => {
        return Math.pow(10, val);
      }
    } else {
      this.yAxisTickFormattingUpdated = this.yAxisTickFormatting;
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
    this.getYTicks();
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

  // Transforms the data to log scale if the yScaleType is log
  updateDataSet(): void {
    if (this.yScaleType === 'log') {
      const logData: CustomLineChartDataType[] = [];
      this.data.forEach(dataSet => {
        const logDataSet: CustomLineChartDataType = cloneDeep(dataSet);
        logDataSet.series.forEach((series) => {
          if (series.value > 0) {
            series.value = Math.log10(Number(series.value));
          }
        });
        logData.push(logDataSet);
      });
      this.results = logData;
    } else {
      if (this.data !== undefined) {
        this.results = this.data
      }
    }
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
    let domain: any[];

    if (this.xScaleType === 'linear' || this.xScaleType === 'log') {
      values = values.map(v => Number(v));
    }

    let min: number;
    let max: number;
    if (this.xScaleType === 'time' || this.xScaleType === 'linear' || this.xScaleType === 'log') {
      const [minValue, maxValue]: [number, number] = ArrayUtilsCommon.getMinMax(values);
      min = this.hasValue(this.xScaleMin)
        ? this.xScaleMin
        : minValue;

      max = this.hasValue(this.xScaleMax)
        ? this.xScaleMax
        : maxValue;
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
    const isLogScale: boolean = this.yScaleType === 'log';
    const domain: any[] = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
      }
    }

    const values: any[] = [...domain];
    if (!this.autoScale && !isLogScale) {
      values.push(0);
    }

    const [minValue, maxValue]: [number, number] = ArrayUtilsCommon.getMinMax(values);
    const min: number = this.hasValue(this.yScaleMin)
      ? this.yScaleMin
      : isLogScale ? Math.floor(minValue) : minValue;

    const max: number = this.hasValue(this.yScaleMax)
      ? this.yScaleMax
      : isLogScale ? Math.ceil(maxValue) : maxValue;

    return [min, max];
  }

  getYTicks(): void {
    if (this.yScaleType === 'log') {
      const ticks: number[] = [];
      for (let i: number = this.yDomain[0]; i < this.yDomain[1] + 1; i++) {
        ticks.push(i);
      }
      this.yAxisTicks = ticks;
    } else {
      this.yAxisTicks = undefined;
    }
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

export interface CustomLineChartDataType {
  name: string;
  series: CustomLineChartDataSeriesType[];
}

export interface CustomLineChartDataSeriesType {
  name: any;
  value: any;
}
