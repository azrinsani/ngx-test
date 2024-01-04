import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, HostListener, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { scaleLinear, scaleLog, scalePoint, scaleTime } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, id, ViewDimensions } from '@swimlane/ngx-charts';

@Component({
  selector: 'ga-ngx-charts-summary-chart',
  template: `
    <ngx-charts-chart
      class="summary-chart"
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
        <svg:g [attr.clip-path]="clipPath">
          <svg:g *ngFor="let series of stackedResultPolygons; trackBy:trackBy; let i = index" [@animationState]="'active'">
            <svg:polygon
              [attr.points]="getPointsAsString(dims, series)"
              [attr.fill]="this.fieldColors[i]"
            />
          </svg:g>
        </svg:g>
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
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
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          [referenceLines]="referenceLines"
          [showRefLines]="showRefLines"
          [showRefLabels]="showRefLabels"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
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
export class CustomSummaryChartComponent extends BaseChartComponent {
  @Input() legend: boolean;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: string = 'below';
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
  @Input() roundDomains: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() showRefLines: boolean = false;
  @Input() referenceLines: any;
  @Input() showRefLabels: boolean = true;
  @Input() xScaleType: string = 'linear';
  @Input() xScaleMin: any;
  @Input() xScaleMax: any;
  @Input() yScaleMin: number;
  @Input() yScaleMax: number;

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
  stackedResultPolygons: any[] = [];
  fieldColors: string[] = ['#83a9ce', '#d38382', '#bacd8d', '#a893be'];
  fieldLabels: string[] = ['Sand', 'Clay', 'Silt', 'Organic Carbon'];
  tickIncrement: number = 5;

  update(): void {
    super.update();

    if (!this.xAxisTickFormatting) {
      this.xAxisTickFormatting = (val): number => {
        return Math.trunc(val);
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

    if (!this.xAxisTicks) {
      this.xAxisTicks = this.getXAxisTicks(this.xDomain);
    }

    this.yDomain = this.getYDomain();
    this.seriesDomain = this.getSeriesDomain();

    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);

    this.updateTimeline();
    this.updateStackedResultPolygons();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

    this.clipPathId = 'clip' + id().toString();
    this.clipPath = `url(#${this.clipPathId})`;
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

  // Transform coordinates from x, y values to x, y coordinates scaled to the graph's width/height and min/max scales
  scalePoints(dims: any, points: any[]): number[][] {
    const scaledPoints: number[][] = [];
    const scaleX: number = Math.abs(dims.width / (this.xDomain[1] - this.xDomain[0]));
    const scaleY: number = Math.abs(dims.height / (this.yScaleMax - this.yScaleMin));
    points.forEach((point) => {
      scaledPoints.push([(Math.abs(point.name) - this.xScaleMin) * scaleX, Math.abs(point.value) * scaleY]);
    });
    return scaledPoints;
  }

  // Transform array of number pairs to array of strings
  getPointsAsString(dims: any, points: any[]): string {
    const scaledPoints: number[][] = this.scalePoints(dims, points);
    let pointsString: string = '';
    scaledPoints.forEach((point) => {
      pointsString += point[0] + ',' + point[1] + ' ';
    });
    return pointsString;
  }

  updateStackedResultPolygons(): void {
    const output: any[] = [];
    const initialStackedResult: any[] = JSON.parse(JSON.stringify(this.results[0].series));
    initialStackedResult.splice(0, 1);
    output.push(initialStackedResult);
    for (let resultCounter: number = 1; resultCounter < this.results.length; resultCounter++) {
      output.push([]);
      const stackedResult: any[] = JSON.parse(JSON.stringify(this.results[resultCounter].series));
      stackedResult.splice(0, 1);
      for (let stackedResultCounter: number = 0; stackedResultCounter < stackedResult.length; stackedResultCounter++) {
        stackedResult[stackedResultCounter].name += output[resultCounter - 1][stackedResultCounter].name;
      }
      output[resultCounter] = stackedResult;
    }
    for (let i: number = output.length - 1; i > 0; i--) {
      const adjacentStackValues: any[] = [...output[i - 1]].reverse();
      output[i].push(...adjacentStackValues);
    }
    output[0].push({ name: 0, value: this.yScaleMin });
    output[0].push({ name: 0, value: 0 });
    this.stackedResultPolygons = output;
  }

  getXAxisTicks(data: number[]): number[] {
    const maxValue: number = Math.max(...data);
    const minTick: number = 0;
    const maxTick: number = Math.trunc(maxValue / this.tickIncrement);
    const ticks: number[] = [];

    for (let i: number = minTick; i < maxTick + 1; i++) {
      ticks.push(i * this.tickIncrement);
    }

    return ticks;
  }

  getXDomain(): any[] {
    // Custom xDomainValues getter
    let values: any[] = this.results[0].series.map((obj) => obj.name);
    for (let resultsCounter: number = 1; resultsCounter < this.results.length; resultsCounter++) {
      for (let valuesIndex: number = 0; valuesIndex < values.length; valuesIndex++) {
        values[valuesIndex] += this.results[resultsCounter].series[valuesIndex].name;
      }
    }

    this.xScaleType = this.getScaleType(values);
    let domain: any[] = [];

    if (this.xScaleType === 'linear' || this.xScaleType === 'log') {
      values = values.map(v => Number(v));
    }

    let min: number;
    let max: number;
    if (this.xScaleType === 'time' || this.xScaleType === 'linear' || this.xScaleType === 'log') {
      min = this.xScaleMin
        ? this.xScaleMin
        : Math.min(...values);

      max = this.xScaleMax
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
      domain[1] += this.tickIncrement - (domain[1] % this.tickIncrement); // Make sure the domain max is rounded up to tickIncrement
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

    const min: number = this.yScaleMin
      ? this.yScaleMin
      : Math.min(...values);

    const max: number = this.yScaleMax
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

  getScaleType(values: any[]): string {
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

    this.customColors = (val): string => {
      for (let i: number = 0; i < this.fieldLabels.length; i++) {
        if (val === this.fieldLabels[i]) {
          return this.fieldColors[i];
        }
      }
    };
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
      opts.domain = this.fieldLabels;
      opts.colors = this.colors;
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
