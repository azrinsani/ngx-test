import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, ViewDimensions } from '@swimlane/ngx-charts';
import { StrongTickType } from './strong.tick.type';

/**
 * Bar chart with extra customization:
 *  - 'strongYAxisTicks' input, will add special bold lines on the y axis with text*/
@Component({
  selector: 'ga-ngx-charts-bar-vertical',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)">
      <svg:g [attr.transform]="transform" class="bar-chart chart">
        <svg:g ngx-charts-x-axis
               *ngIf="xAxis"
               [xScale]="xScale"
               [dims]="dims"
               [showLabel]="showXAxisLabel"
               [labelText]="xAxisLabel"
               [trimTicks]="trimXAxisTicks"
               [maxTickLength]="maxXAxisTickLength"
               [tickFormatting]="xAxisTickFormatting"
               [ticks]="xAxisTicks"
               [xAxisOffset]="dataLabelMaxHeight.negative"
               (dimensionsChanged)="updateXAxisHeight($event)">
        </svg:g>
        <svg:g ngx-charts-y-axis
               *ngIf="yAxis"
               [yScale]="yScale"
               [dims]="dims"
               [showGridLines]="showGridLines"
               [showLabel]="showYAxisLabel"
               [labelText]="yAxisLabel"
               [trimTicks]="trimYAxisTicks"
               [maxTickLength]="maxYAxisTickLength"
               [tickFormatting]="yAxisTickFormatting"
               [ticks]="yAxisTicks"
               (dimensionsChanged)="updateYAxisWidth($event)">
        </svg:g>
        <svg:g ngx-charts-series-vertical
               [xScale]="xScale"
               [yScale]="yScale"
               [colors]="colors"
               [series]="results"
               [dims]="dims"
               [gradient]="gradient"
               [tooltipDisabled]="tooltipDisabled"
               [tooltipTemplate]="tooltipTemplate"
               [showDataLabel]="showDataLabel"
               [dataLabelFormatting]="dataLabelFormatting"
               [activeEntries]="activeEntries"
               [roundEdges]="roundEdges"
               [animations]="animations"
               (activate)="onActivate($event)"
               (deactivate)="onDeactivate($event)"
               (select)="onClick($event)"
               (dataLabelHeightChanged)="onDataLabelMaxHeightChanged($event)"
        >
        </svg:g>
        <!-- Custom SVG -->
        <svg:g *ngFor="let strongTick of strongYAxisTicks">
          <svg:text class="chartText"
                    stroke-width="0.01"
                    [attr.text-anchor]="strongTick.alignment === 'left' ? 'start' : 'end'"
                    [attr.transform]="getTextTransform(strongTick.value, strongTick.alignment)">
            {{strongTick.text}}
          </svg:text>
          <svg:g fill="none" stroke="gray" stroke-width="2">
            <svg:path
              [attr.stroke-dasharray]="'1 0'"
              [attr.d]="getLineD(strongTick.value, strongTick.alignment)"
            />
          </svg:g>
        </svg:g>
        <!-- End of custom SVG -->
      </svg:g>
    </ngx-charts-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./custom.chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomBarVerticalComponent extends BaseChartComponent {
  @Input() legend = false;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: string = 'right';
  @Input() xAxis;
  @Input() yAxis;
  @Input() showXAxisLabel;
  @Input() showYAxisLabel;
  @Input() xAxisLabel;
  @Input() yAxisLabel;
  @Input() tooltipDisabled: boolean = false;
  @Input() gradient: boolean;
  @Input() showGridLines: boolean = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: string;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() barPadding = 8;
  @Input() roundDomains: boolean = false;
  @Input() roundEdges: boolean = true;
  @Input() yScaleMax: number;
  @Input() yScaleMin: number;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero: boolean = true;
  @Input() strongYAxisTicks: StrongTickType[]; // Special ticks with text and a strong line for comparison with the bar chart value

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate', { static: true }) tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  xScale: any;
  yScale: any;
  xDomain: any;
  yDomain: any;
  transform: string;
  colors: ColorHelper;
  margin: any[] = [10, 20, 10, 20];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  legendOptions: any;
  dataLabelMaxHeight: any = { negative: 0, positive: 0 };

  update(): void {
    super.update();

    if (!this.showDataLabel) {
      this.dataLabelMaxHeight = { negative: 0, positive: 0 };
    }
    this.margin = [10 + this.dataLabelMaxHeight.positive, 20, 10 + this.dataLabelMaxHeight.negative, 20];

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

    if (this.showDataLabel) {
      this.dims.height -= this.dataLabelMaxHeight.negative;
    }
    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0] + this.dataLabelMaxHeight.negative})`;
  }

  getLineD(yValue: number, alignment: string): string {
    const scaledY: number = this.dims.height - yValue * this.dims.height / this.yScaleMax;
    if (alignment === 'left') {
      const d: string = 'M0 ' + scaledY + ' ' + (this.dims.width * 1 / 3) + ' ' + scaledY;
      return d;
    } else {
      const d: string = 'M' + this.dims.width * 2 / 3 + ' ' + scaledY + ' ' + this.dims.width + ' ' + scaledY;
      return d;
    }
  }

  // Produce transform value for SVG text
  getTextTransform(yValue: number, alignment: string): string {
    const yOffset: number = -10;
    const scaledY: number = this.dims.height - yValue * this.dims.height / this.yScaleMax + yOffset;
    if (alignment === 'left') {
      return 'translate(10, ' + scaledY + ')';
    } else {
      return 'translate(' + (this.dims.width - 10) + ', ' + scaledY + ')';
    }
  }

  getXScale(): any {
    this.xDomain = this.getXDomain();
    const spacing: number = this.xDomain.length / (this.dims.width / this.barPadding + 1);
    return scaleBand()
      .range([0, this.dims.width])
      .paddingInner(spacing)
      .domain(this.xDomain);
  }

  getYScale(): any {
    this.yDomain = this.getYDomain();
    const scale: ScaleLinear<number, number> = scaleLinear()
      .range([this.dims.height, 0])
      .domain(this.yDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getXDomain(): any[] {
    return this.results.map(d => d.name);
  }

  getYDomain(): [number, number] {
    const values: any = this.results.map(d => d.value);

    let min: number = this.yScaleMin
      ? Math.min(this.yScaleMin, ...values)
      : Math.min(0, ...values);
    if (this.yAxisTicks && !this.yAxisTicks.some(isNaN)) {
      min = Math.min(min, ...this.yAxisTicks);
    }

    let max: number = this.yScaleMax
      ? Math.max(this.yScaleMax, ...values)
      : Math.max(0, ...values);
    if (this.yAxisTicks && !this.yAxisTicks.some(isNaN)) {
      max = Math.max(max, ...this.yAxisTicks);
    }
    return [min, max];
  }

  onClick(data: EventEmitter<any>): void {
    this.select.emit(data);
  }

  setColors(): void {
    let domain: any;
    if (this.schemeType === 'ordinal') {
      domain = this.xDomain;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions(): any {
    const options: any = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (options.scaleType === 'ordinal') {
      options.domain = this.xDomain;
      options.colors = this.colors;
      options.title = this.legendTitle;
    } else {
      options.domain = this.yDomain;
      options.colors = this.colors.scale;
    }
    return options;
  }

  updateYAxisWidth({ width }: any): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }: any): void {
    this.xAxisHeight = height;
    this.update();
  }

  onDataLabelMaxHeightChanged(event: any): void {
    if (event.size.negative) {
      this.dataLabelMaxHeight.negative = Math.max(this.dataLabelMaxHeight.negative, event.size.height);
    } else {
      this.dataLabelMaxHeight.positive = Math.max(this.dataLabelMaxHeight.positive, event.size.height);
    }
    if (event.index === (this.results.length - 1)) {
      setTimeout(() => this.update());
    }
  }

  onActivate(item: any): any {
    const idx: number = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item: any): any {
    const idx: number = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

}
