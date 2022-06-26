import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, ViewDimensions } from '@swimlane/ngx-charts';
import { BoxPlotSeriesType, IBoxModelType, LegendOptionType, LegendPosition, ScaleType } from '../../shared/types/custom.chart.type';
import { scaleBand, ScaleBand } from 'd3';

@Component({
  selector: 'ga-box-plot-series-chart',
  templateUrl: './custom.box.plot.series.chart.component.html',
  styleUrls: ['./custom.box.plot.series.chart.component.scss'],
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
  @Input() legendOptionsConfig: LegendOptionType;
  @Input() showGridLines: boolean = true;
  @Input() xAxis: boolean = true;
  @Input() yAxis: boolean = true;
  @Input() showXAxisLabel: boolean = true;
  @Input() showYAxisLabel: boolean = true;
  @Input() roundDomains: boolean = false;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() boxHasRoundedEdges: boolean = true;
  @Input() boxColor: string = '#888888';
  @Input() tooltipDisabled: boolean = false;
  @Input() whiskerStrokeWidth: number = 5;
  @Input() whiskerNotchLineWidth: number = 10;
  @Input() medianLineWidth: number = 5;

  @Output() selectItem: EventEmitter<IBoxModelType> = new EventEmitter();
  @Output() activateItem: EventEmitter<IBoxModelType> = new EventEmitter();
  @Output() deactivateItem: EventEmitter<IBoxModelType> = new EventEmitter();
  @ContentChild('tooltipTemplate', { static: false }) tooltipTemplate: TemplateRef<any>;

  results: BoxPlotSeriesType[];
  dims: ViewDimensions;
  colors: ColorHelper;
  transform: string;
  margin: [number, number, number, number] = [10, 20, 10, 20];
  legendOptions: LegendOptionType;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  xDomain: Array<string | number | Date>;
  yDomain: number[];
  seriesDomain: string[];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  schemeScaleType: ScaleType = ScaleType.Ordinal;

  // Performs a full redraw/update of the chart
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
    this.seriesDomain = this.results.map(d => `${d.name}`);
    this.scheme = 'vivid';
    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);
    this.setColors();
    this.legendOptions = this.getLegendOptions();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  // Set the chart series colors
  setColors(): void {
    let domain: string[] | number[] = [];
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.seriesDomain;
    } else {
      domain = this.yDomain;
    }
    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  // Gets the Scale for x-axis
  getXScale(domain: Array<string | number | Date>, width: number): ScaleBand<string> {
    return scaleBand()
      .domain(domain.map(d => d.toString()))
      .rangeRound([0, width])
      .padding(0.5);
  }

  // Gets the Scale for y-axis
  getYScale(domain: number[], height: number): ScaleLinear<number, number> {
    const scale: ScaleLinear<number, number> = scaleLinear().domain(domain).range([height, 0]);
    return this.roundDomains ? scale.nice() : scale;
  }

  // Gets the Unique Box Chart Values
  getUniqueBoxChartXDomainValues(results: BoxPlotSeriesType[]): Array<string | number | Date> {
    const valueSet: Set<string | number | Date> = new Set<string | number | Date>();
    for (const result of results) {
      valueSet.add(result.name);
    }
    return Array.from(valueSet);
  }

  // Obtains the min max range for X data values
  getXDomain(): Array<string | number | Date> {
    let domain: Array<string | number | Date> = [];
    const values: Array<string | number | Date> = this.getUniqueBoxChartXDomainValues(this.results);
    let min: number;
    let max: number;
    if (typeof values[0] === 'string') {
      domain = values.map(val => val.toString());
    } else if (typeof values[0] === 'number') {
      const mappedValues: number[] = values.map(v => Number(v));
      min = Math.min(...mappedValues);
      max = Math.max(...mappedValues);
      domain = [min, max];
    } else {
      const mappedValues: number[] = values.map(v => Number(new Date(v)));
      min = Math.min(...mappedValues);
      max = Math.max(...mappedValues);
      domain = [new Date(min), new Date(max)];
    }
    return domain;
  }

  // Obtains the min max range for Y data values
  getYDomain(): number[] {
    const domain: Array<number | Date> = [];
    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
      }
    }
    const values: Array<number | Date> = [...domain];
    const mappedValues: number[] = values.map(v => Number(v));
    const min: number = Math.min(...mappedValues);
    const max: number = Math.max(...mappedValues);
    return [min, max];
  }

  // Updates Y-Axis width and refreshes the chart
  updateYAxisWidth(event: any): void {
    this.yAxisWidth = event.width;
    this.update();
  }

  // Updates X-Axis height and refreshes the chart
  updateXAxisHeight(event: any): void {
    this.xAxisHeight = event.height;
    this.update();
  }

  // When user clicks on the series
  onClick(data: IBoxModelType): void {
    this.selectItem.emit(data);
  }

  // When user activates the series
  onActivate(data: IBoxModelType): void {
    this.activateItem.emit(data);
  }

  // When user de-activates the series
  onDeactivate(data: IBoxModelType): void {
    this.deactivateItem.emit(data);
  }

  // Updates the legend
  private getLegendOptions(): LegendOptionType {
    const legendOpts: LegendOptionType = {
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

  // For ngFor to improve performance
  trackBy(index: number, item: BoxPlotSeriesType): string | number | Date {
    return item.name;
  }
}
