import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, HostListener, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, getDomain, getScale, id, ViewDimensions } from '@swimlane/ngx-charts';
import { BoxChartMultiSeries, BoxChartSeries, IBoxModel, LegendOptions, LegendPosition, ScaleType, StringOrNumberOrDate } from 'src/shared/types/custom.chart.type';
import { scaleBand, ScaleBand } from 'd3';

// Modified scatter plot which also displays box and whiskers for given quartiles, median and outlier range
@Component({
  selector: 'ga-box-plot-series-chart',
  templateUrl: './custom.box.plot.series.chart.component.html',
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
export class CustomBoxPlotSeriesChartComponent extends BaseChartComponent {
  @Input() legend: boolean = false;
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Input() legendTitle: string = 'Legend';
  @Input() legendOptionsConfig: LegendOptions;
  @Input() showGridLines: boolean = true;
  @Input() xAxis: boolean = true;
  @Input() yAxis: boolean = true;
  @Input() showXAxisLabel: boolean = true;
  @Input() showYAxisLabel: boolean = true;
  @Input() roundDomains: boolean = false;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() roundEdges: boolean = true;
  @Input() boxColor: string = '#888888';
  @Input() tooltipDisabled: boolean = false;
  @Input() whiskerStrokeWidth: number = 5;
  @Input() medianLineWidth: number = 5;

  @Output() select: EventEmitter<IBoxModel> = new EventEmitter();
  @Output() activate: EventEmitter<IBoxModel> = new EventEmitter();
  @Output() deactivate: EventEmitter<IBoxModel> = new EventEmitter();
  @ContentChild('tooltipTemplate', { static: false }) tooltipTemplate: TemplateRef<any>;

  results: BoxChartMultiSeries;
  dims: ViewDimensions;
  colors: ColorHelper;
  transform: string;
  margin: [number, number, number, number] = [10, 20, 10, 20];
  legendOptions: LegendOptions;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  xDomain: StringOrNumberOrDate[];
  yDomain: number[];
  seriesDomain: string[];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  schemeScaleType: ScaleType = ScaleType.Ordinal;

  trackBy(index: number, item: BoxChartSeries): StringOrNumberOrDate {
    return item.name;
  }

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
      legendPosition: this.legendPosition
    });
    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();
    this.seriesDomain = this.getSeriesDomain();
    console.log(this.results);
    this.scheme = 'vivid';
    this.setScales();
    this.setColors();
    this.legendOptions = this.getLegendOptions();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  setColors(): void {
    let domain: string[] | number[] = [];
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.seriesDomain;
    } else {
      domain = this.yDomain;
    }
    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  setScales() {
    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);
  }

  getXScale(domain: Array<string | number | Date>, width: number): ScaleBand<string> {
    const scale = scaleBand()
      .domain(domain.map(d => d.toString()))
      .rangeRound([0, width])
      .padding(0.5);

    return scale;
  }

  getYScale(domain: number[], height: number): ScaleLinear<number, number> {
    const scale = scaleLinear().domain(domain).range([height, 0]);

    return this.roundDomains ? scale.nice() : scale;
  }

  getUniqueBoxChartXDomainValues(results: BoxChartMultiSeries) {
    const valueSet = new Set<string | number | Date>();
    for (const result of results) {
      valueSet.add(result.name);
    }
    return Array.from(valueSet);
  }

  getXDomain(): Array<string | number | Date> {
    let domain: Array<string | number | Date> = [];
    const values: Array<string | number | Date> = this.getUniqueBoxChartXDomainValues(this.results);
    let min: number;
    let max: number;
    if (typeof values[0] === 'string') {
      domain = values.map(val => val.toString());
    } else if (typeof values[0] === 'number') {
      const mappedValues = values.map(v => Number(v));
      min = Math.min(...mappedValues);
      max = Math.max(...mappedValues);
      domain = [min, max];
    } else {
      const mappedValues = values.map(v => Number(new Date(v)));
      min = Math.min(...mappedValues);
      max = Math.max(...mappedValues);
      domain = [new Date(min), new Date(max)];
    }
    return domain;
  }

  getYDomain(): number[] {
    const domain: Array<number | Date> = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
      }
    }

    const values = [...domain];
    const mappedValues = values.map(v => Number(v));

    const min: number = Math.min(...mappedValues);
    const max: number = Math.max(...mappedValues);

    return [min, max];
  }

  getSeriesDomain(): string[] {
    return this.results.map(d => `${d.name}`);
  }

  updateYAxisWidth({ width }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onClick(data: IBoxModel): void {
    this.select.emit(data);
  }

  onActivate(data: IBoxModel): void {
    this.activate.emit(data);
  }

  onDeactivate(data: IBoxModel): void {
    this.deactivate.emit(data);
  }

  private getLegendOptions(): LegendOptions {
    const legendOpts: LegendOptions = {
      scaleType: this.schemeType as unknown as ScaleType,
      colors: this.colors,
      domain: [],
      position: this.legendPosition,
      title: this.legendTitle
    };
    if (this.schemeType === ScaleType.Ordinal) {
      legendOpts.domain = this.xDomain;
      legendOpts.colors = this.colors;
    } else {
      legendOpts.domain = this.yDomain;
      legendOpts.colors = this.colors.scale;
    }
    return legendOpts;
  }
}
