import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, HostListener, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, getDomain, getScale, id, ViewDimensions } from '@swimlane/ngx-charts';

// Modified scatter plot which also displays box and whiskers for given quartiles, median and outlier range
@Component({
  selector: 'ga-box-plot-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [activeEntries]="activeEntries"
      [legendOptions]="legendOptions"
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
      <svg:g [attr.transform]="transform" class="bubble-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [showGridLines]="showGridLines"
          [dims]="dims"
          [xScale]="xScale"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        />
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [showGridLines]="showGridLines"
          [yScale]="yScale"
          [dims]="dims"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          (dimensionsChanged)="updateYAxisWidth($event)"
        />
        <svg:rect
          class="bubble-chart-area"
          x="0"
          y="0"
          [attr.width]="dims.width"
          [attr.height]="dims.height"
          style="fill: rgb(255, 0, 0); opacity: 0; cursor: 'auto';"
          (mouseenter)="deactivateAll()"
        />
        <svg:rect
          [attr.width]="dims.width * (boxEndProportion - boxStartProportion)"
          [attr.height]="yValueToHeight((quartile3 - quartile1), dims.height)"
          [attr.transform]="'translate(' + (dims.width * boxStartProportion) + ', ' + (dims.height - yValueToPixels(quartile3, dims.height)) + ')'"
          [attr.fill]="'white'"
          [attr.stroke]="'black'"
          [attr.stroke-width]="2"
        />
        <!-- Custom lines start -->
        <!-- Median line -->
        <svg:line
          [attr.x1]="dims.width * boxStartProportion"
          [attr.x2]="dims.width * boxEndProportion"
          [attr.y1]="dims.height - yValueToPixels(median, dims.height)"
          [attr.y2]="dims.height - yValueToPixels(median, dims.height)"
          [attr.stroke]="'black'"
          [attr.stroke-width]="2"
        />
        <!-- Upper non-outlier line -->
        <svg:line
          [attr.x1]="dims.width / 2"
          [attr.x2]="dims.width / 2"
          [attr.y1]="dims.height - yValueToPixels(quartile3, dims.height)"
          [attr.y2]="dims.height - yValueToPixels(nonOutlierMax, dims.height)"
          [attr.stroke]="'black'"
          [attr.stroke-width]="2"
        />
        <!-- Lower non-outlier line -->
        <svg:line
          [attr.x1]="dims.width / 2"
          [attr.x2]="dims.width / 2"
          [attr.y1]="dims.height - yValueToPixels(quartile1, dims.height)"
          [attr.y2]="dims.height - yValueToPixels(nonOutlierMin, dims.height)"
          [attr.stroke]="'black'"
          [attr.stroke-width]="2"
        />
        <!-- Custom lines end -->
        <svg:g [attr.clip-path]="clipPath">
          <svg:g *ngFor="let series of data; trackBy: trackBy" [@animationState]="'active'">
            <svg:g
              ga-ngx-charts-bubble-series
              [xScale]="xScale"
              [yScale]="yScale"
              [rScale]="rScale"
              [xScaleType]="xScaleType"
              [yScaleType]="yScaleType"
              [xAxisLabel]="xAxisLabel"
              [yAxisLabel]="yAxisLabel"
              [colors]="colors"
              [data]="series"
              [activeEntries]="activeEntries"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="tooltipTemplate"
              (select)="onClick($event, series)"
              (activate)="onActivate($event)"
              (deactivate)="onDeactivate($event)"
            />
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['./custom.chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
export class CustomBoxPlotChartComponent extends BaseChartComponent {
  @Input() showGridLines: boolean = true;
  @Input() legend = false;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: string = 'right';
  @Input() xAxis: boolean = true;
  @Input() yAxis: boolean = true;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() roundDomains: boolean = false;
  @Input() maxRadius = 3;
  @Input() minRadius = 3;
  @Input() autoScale: boolean;
  @Input() schemeType = 'ordinal';
  @Input() tooltipDisabled: boolean = false;
  @Input() xScaleMin: any;
  @Input() xScaleMax: any;
  @Input() yScaleMin: any;
  @Input() yScaleMax: any;
  @Input() scaleType = 'linear';
  @Input() nonOutlierMax: number; // Value above which to display points as outliers
  @Input() nonOutlierMin: number; // Value below which to display points as outliers
  @Input() median: number; // median of values
  @Input() quartile1: number; // The value of the first quartile (25% of values are below this)
  @Input() quartile3: number; // The value of the third quartile (25% of values are above this)

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  colors: ColorHelper;
  margin = [10, 20, 10, 20];
  bubblePadding = [0, 0, 0, 0];
  data: any;

  legendOptions: any;
  transform: string;

  clipPath: string;
  clipPathId: string;

  seriesDomain: any[];
  xDomain: any[];
  yDomain: any[];
  rDomain: number[];

  xScaleType: string = this.scaleType;
  yScaleType: string = this.scaleType;

  yScale: any;
  xScale: any;
  rScale: any;

  xAxisHeight: number = 0;
  yAxisWidth: number = 0;

  activeEntries: any[] = [];

  boxStartProportion = 7 / 16; // Ratio for how far along graph width the box should start
  boxEndProportion = 9 / 16; // Ratio for how far along graph width the box should end

  update(): void {
    super.update();

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

    this.seriesDomain = this.results.map(d => d.name);
    this.rDomain = this.getRDomain();
    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();

    this.transform = `translate(${this.dims.xOffset},${this.margin[0]})`;

    const colorDomain: any[] = this.schemeType === 'ordinal' ? this.seriesDomain : this.rDomain;
    this.colors = new ColorHelper(this.scheme, this.schemeType, colorDomain, this.customColors);

    this.data = this.results;

    this.minRadius = Math.max(this.minRadius, 1);
    this.maxRadius = Math.max(this.maxRadius, 1);

    this.rScale = this.getRScale(this.rDomain, [this.minRadius, this.maxRadius]);

    this.bubblePadding = [0, 0, 0, 0];
    this.setScales();

    this.bubblePadding = this.getBubblePadding();
    this.setScales();

    this.legendOptions = this.getLegendOptions();

    this.clipPathId = 'clip' + id().toString();
    this.clipPath = `url(#${this.clipPathId})`;
  }

  @HostListener('mouseleave')
  hideCircles(): void {
    this.deactivateAll();
  }

  onClick(data: any, series?: any): void {
    if (series) {
      data.series = series.name;
    }

    this.select.emit(data);
  }

  getBubblePadding(): number[] {
    let yMin: number = 0;
    let xMin: number = 0;
    let yMax: number = this.dims.height;
    let xMax: number = this.dims.width;

    for (const s of this.data) {
      for (const d of s.series) {
        const r: any = this.rScale(d.r);
        const cx: any = this.xScaleType === 'linear' ? this.xScale(Number(d.x)) : this.xScale(d.x);
        const cy: any = this.yScaleType === 'linear' ? this.yScale(Number(d.y)) : this.yScale(d.y);
        xMin = Math.max(r - cx, xMin);
        yMin = Math.max(r - cy, yMin);
        yMax = Math.max(cy + r, yMax);
        xMax = Math.max(cx + r, xMax);
      }
    }

    xMax = Math.max(xMax - this.dims.width, 0);
    yMax = Math.max(yMax - this.dims.height, 0);

    return [yMin, xMax, yMax, xMin];
  }

  setScales(): void {
    let width: number = this.dims.width;
    if (this.xScaleMin === undefined && this.xScaleMax === undefined) {
      width = width - this.bubblePadding[1];
    }
    let height: number = this.dims.height;
    if (this.yScaleMin === undefined && this.yScaleMax === undefined) {
      height = height - this.bubblePadding[2];
    }
    this.xScale = this.getXScale(this.xDomain, width);
    this.yScale = this.getYScale(this.yDomain, height);
  }

  getYScale(domain: any[], height: number): any {
    return getScale(domain, [height, this.bubblePadding[0]], this.yScaleType, this.roundDomains);
  }

  getXScale(domain: any[], width: number): any {
    return val => width / 2;
  }

  getRScale(domain: number[], range: number[]): any {
    const scale: ScaleLinear<number, number> = scaleLinear()
      .range(range)
      .domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  getLegendOptions(): any {
    const opts: any = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      position: this.legendPosition,
      title: undefined
    };

    if (opts.scaleType === 'ordinal') {
      opts.domain = this.seriesDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.rDomain;
      opts.colors = this.colors.scale;
    }

    return opts;
  }

  getXDomain(): any[] {
    const values: any[] = [];

    for (const results of this.results) {
      for (const d of results.series) {
        if (!values.includes(d.x)) {
          values.push(d.x);
        }
      }
    }

    // this.xScaleType = getScaleType(values);
    return getDomain(values, this.xScaleType, this.autoScale, this.xScaleMin, this.xScaleMax);
  }

  getYDomain(): any[] {
    const values: any[] = [];

    for (const results of this.results) {
      for (const d of results.series) {
        if (!values.includes(d.y)) {
          values.push(d.y);
        }
      }
    }

    // this.yScaleType = getScaleType(values);
    return getDomain(values, this.yScaleType, this.autoScale, this.yScaleMin, this.yScaleMax);
  }

  getRDomain(): number[] {
    let min: number = Infinity;
    let max: number = -Infinity;

    for (const results of this.results) {
      for (const d of results.series) {
        const value: number = Number(d.r) || 1;
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }

    return [min, max];
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
    const idx: number = this.activeEntries.findIndex(d => {
      return d.name === item.name;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item: any): void {
    const idx: number = this.activeEntries.findIndex(d => {
      return d.name === item.name;
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

  trackBy(index: number, item: any): string {
    return item.name;
  }

  // Given a y value, return the y pixel at which to display it on the chart
  yValueToPixels(value: number, heightMax: number): number {
    return (value - this.yScaleMin) * (heightMax / (this.yScaleMax - this.yScaleMin));
  }

  // Given a height in value terms, return height in pixel terms
  yValueToHeight(value: number, heightMax: number): number {
    return value * (heightMax / (this.yScaleMax - this.yScaleMin));
  }
}
