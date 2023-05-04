import { Component, Input, Output, ViewEncapsulation, EventEmitter, ChangeDetectionStrategy, ContentChild, TemplateRef, TrackByFunction } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleBand, ScaleLinear, scaleLinear} from 'd3-scale';
import { calculateViewDimensions, DataItem, ViewDimensions } from '@swimlane/ngx-charts';
import { ColorHelper } from '@swimlane/ngx-charts';
import { BaseChartComponent } from '@swimlane/ngx-charts';
import {
  BarOrientation,
  LegendOptions,
  LegendPosition,
  ScaleType,
  SelectableUnitType, YAxisLabelType
} from './custom.grouped.vertical.bar.type';
import { MultiSeries, Series} from '@swimlane/ngx-charts/lib/models/chart-data.model';
import {ScaleBand, scaleLog} from 'd3';

@Component({
  selector: 'ga-ngx-charts-grouped-vertical-bar',
  templateUrl: './custom.grouped.vertical.bar.component.html',
  styleUrls: ['./custom.grouped.vertical.bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1,
          transform: '*'
        }),
        animate(500, style({ opacity: 0, transform: 'scale(0)' }))
      ])
    ])
  ]
})
export class CustomGroupedVerticalBarComponent extends BaseChartComponent {
  @Input() data: MultiSeries = []; // The Actual Data that will draw the plot
  @Input() showXAxisLabel: boolean = true; // This shows a label under the X-axes ticks and tick labels.
  @Input() showYAxisLabel: boolean = true;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: YAxisLabelType;
  @Input() tooltipDisabled: boolean = false;
  @Input() enableGradientEffectOnBars: boolean = false; // This enables a nice looking gradient on each bar strips
  @Input() showGridLines: boolean = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: ScaleType;
  @Input() trimXAxisTicks: boolean = false; // This trims the label in the X-Axis, for example in an X-Axis of 'Australia', 'USA','UK', a trimmed X-Acis of maxXAxisTickLength=5 will be 'Austr..'
  @Input() maxXAxisTickLength: number = 16; // This value has no effect when trimXAxisTicks is set as false
  @Input() autoRotateXAxisTicks: boolean = true; // Enables the automatic rotation of x-axis ticks to prevent overlaps
  @Input() xAxisTickFormatting: (any) => string; // Pass in an arrow function which takes the data and returns a string
  @Input() yAxisTickFormatting: (any) => string; // Pass in an arrow function which takes the data and returns a string
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() groupPadding: number = 16; // This is the space between the grouped vertical bars
  @Input() barPadding: number = 0; // This is the space between vertical bars within the group
  @Input() roundDomains: boolean = false; // This rounds the number
  @Input() roundEdges: boolean = true; // This creates rounded corners on the bar strips on the
  @Input() yScaleMax: number; // The maximum value of the Y Scale. If not specified it will be set with the highest value in the data set
  @Input() showDataLabel: boolean = false; // This shows the data at the top of every bar
  @Input() dataLabelFormatting: (any) => string; // Formats how the data at the top of every bar should appear. Pass in an arrow function which takes the data and returns a string.
  @Input() showLegend: boolean = false; // Shows the legend
  @Input() legendTitle: string;
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Input() useLogYScale: boolean = false;
  @Input() unitText: string = "Unit:";
  @Input() selectableUnits: SelectableUnitType[] = [];
  @Input() selectedUnitName: string;
  @Output() dataItemHoverEnter: EventEmitter<any> = new EventEmitter(); // Emits value when mouse hovers over a bar or a legend item
  @Output() dataItemHoverLeave: EventEmitter<any> = new EventEmitter(); // Emits value when mouse un-hovers over a bar or a legend item
  @Output() dataItemClick: EventEmitter<any> = new EventEmitter(); // Emits value when a bar or a legend item is clicked
  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>; // Changes the popup that is displayed when mouse is hovered over each individual bar charts. Just add an <ng-template #tooltipTemplate let-model="model"> to create this. See => https://github.com/swimlane/ngx-charts/blob/8ebb3dbcbbea443fefdcafd1f5c9069df0e0c4ae/src/app/app.component.html#L992

  dims: ViewDimensions;
  groupDomain: string[]; // A group domain is basically all the group names
  innerDomain: string[];
  valueDomain: [number, number];
  groupScale: any;
  innerScale: any;
  valueScale: any;
  transform: string;
  colors: ColorHelper;
  margin: number[] = [10, 20, 10, 20];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  legendOptions: LegendOptions;
  dataLabelMaxHeight: any = { negative: 0, positive: 0 };
  barOrientation = BarOrientation;
  scaleType = ScaleType.Linear;
  legendSpacing = 0;
  yAxisLabelResolved: string;
  yAxisTickFormattingInner: (any) => string;

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
      showXAxis: true,
      showYAxis: true,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.showLegend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });
    if (this.showDataLabel) {
      this.dims.height -= this.dataLabelMaxHeight.negative;
    }
    this.formatDates();
    this.groupDomain = this.getGroupDomain(this.data);
    this.innerDomain = this.getInnerDomain(this.data);
    this.valueDomain = this.getValueDomain(this.data);
    this.groupScale = this.getGroupScale(this.groupDomain);
    this.innerScale = this.getInnerScale(this.innerDomain);
    this.valueScale = this.getYScale(this.valueDomain);
    this.setColors();
    this.legendOptions = this.getLegendOptions();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0] + this.dataLabelMaxHeight.negative})`;
    if (typeof this.yAxisLabel === 'string') {
      this.yAxisLabelResolved = this.yAxisLabel
    } else {
      const selectedUnit: SelectableUnitType = this.selectableUnits.find(selectedUnit => selectedUnit.name === this.selectedUnitName)
      this.yAxisLabelResolved = this.yAxisLabel(selectedUnit);
    }
    if (this.useLogYScale) {
      const logStart: number = Math.floor(Math.log10(Math.min(...this.valueDomain)));
      const logEnd: number = Math.ceil(Math.log10(Math.max(...this.valueDomain)));
      let ticksArray: number[] = [];
      for (let n: number = logStart; n <= logEnd; n++) {
        ticksArray.push(Math.pow(10, n));
      }
      this.yAxisTicks = ticksArray;
    } else {
      this.yAxisTicks = undefined;
    }
  }

  onDataLabelMaxHeightChanged(event: any, groupIndex: number): void {
    if (event.size.negative) {
      this.dataLabelMaxHeight.negative = Math.max(this.dataLabelMaxHeight.negative, event.size.height);
    } else {
      this.dataLabelMaxHeight.positive = Math.max(this.dataLabelMaxHeight.positive, event.size.height);
    }
    if (groupIndex === this.data.length - 1) {
      setTimeout(() => this.update());
    }
  }

  getGroupScale(groupDomain: string[]): ScaleBand<string> {
    const spacing = groupDomain.length / (this.dims.height / this.groupPadding + 1);
    return scaleBand()
      .rangeRound([0, this.dims.width])
      .paddingInner(spacing)
      .paddingOuter(spacing / 2)
      .domain(groupDomain);
  }

  getInnerScale(innerDomain: string[]): ScaleBand<string> {
    const width = (this.groupScale as ScaleBand<string>).bandwidth();
    const spacing = innerDomain.length / (width / this.barPadding + 1);
    return scaleBand().rangeRound([0, width]).paddingInner(spacing).domain(innerDomain);
  }

  getYScale(valueDomain: [number, number]): ScaleLinear<number,number> {
    const scale: ScaleLinear<number, number> = (this.useLogYScale ? scaleLog() : scaleLinear()).range([this.dims.height, 0]).domain(valueDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getGroupDomain(data: MultiSeries): string[] {
    const domain = [];
    for (const series of data) {
      if (!domain.includes(series.name)) {
        domain.push(series.name);
      }
    }
    return domain;
  }

  getInnerDomain(data: MultiSeries): string[] {
    const domain = [];
    for (const series of data) {
      for (const d of series.series) {
        if (!domain.includes(d.name)) {
          domain.push(d.name);
        }
      }
    }
    return domain;
  }

  getValueDomain(data: MultiSeries): [number, number] {
    const domain: any[] = [];
    for (const series of data) {
      for (const d of series.series) {
        if (d.value > 0 && this.useLogYScale) {
          if (!domain.includes(d.value)) {
            domain.push(d.value);
          }
        } else {
          if (!domain.includes(d.value)) {
            domain.push(d.value);
          }
        }
      }
    }
    const min: number = this.useLogYScale ? Math.min(...domain) : Math.min(0, ...domain);
    const max: number = this.yScaleMax ? Math.max(this.yScaleMax, ...domain) : Math.max(this.useLogYScale ? 1 : 0, ...domain);
    return [min, max];
  }

  groupTransform(group: Series): string {
    return `translate(${this.groupScale(group.name)}, 0)`;
  }

  onClick(data: any, group?: Series): void {
    if (group) {
      data.series = group.name;
    }
    this.select.emit(data);
    this.dataItemClick.emit(data);
  }

  trackBy: TrackByFunction<Series> = (index: number, item: Series) => {
    return `${item.name}`;
  };

  setColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.innerDomain;
    } else {
      domain = this.valueDomain;
    }
    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions(): LegendOptions {
    const opts = {
      scaleType: this.schemeType as any,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === ScaleType.Ordinal) {
      opts.domain = this.innerDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.valueDomain;
      opts.colors = this.colors.scale;
    }
    return opts;
  }

  updateYAxisWidth({ width }: { width: number }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }: { height: number }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onDataItemHoverEnter(event: any, group: Series, fromLegend: boolean = false): void {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }
    const items = this.data
      .map(g => g.series)
      .flat()
      .filter(i => {
        if (fromLegend) {
          return i.label === item.name;
        } else {
          return i.name === item.name; // && i.series === item.series;
        }
      });
    this.activeEntries = [...items];
    this.dataItemHoverEnter.emit({ value: item, entries: this.activeEntries });
  }

  onDataItemHoverLeave(event: any, group: Series, fromLegend: boolean = false): void {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }
    this.activeEntries = this.activeEntries.filter(i => {
      if (fromLegend) {
        return i.label !== item.name;
      } else {
        return !(i.name === item.name && i.series === item.series);
      }
    });
    this.dataItemHoverLeave.emit({ value: item, entries: this.activeEntries });
  }
}
