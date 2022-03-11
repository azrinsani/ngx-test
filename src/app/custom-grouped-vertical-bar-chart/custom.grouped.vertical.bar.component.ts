import { Component, Input, Output, ViewEncapsulation, EventEmitter, ChangeDetectionStrategy, ContentChild, TemplateRef, TrackByFunction } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleBand, scaleLinear } from 'd3-scale';
import {calculateViewDimensions, ViewDimensions} from "@swimlane/ngx-charts";
import { ColorHelper } from "@swimlane/ngx-charts";
import { DataItem } from "@swimlane/ngx-charts";
import { BaseChartComponent } from "@swimlane/ngx-charts";
import {BarOrientation, LegendOptions, LegendPosition, ScaleType} from './custom.grouped.vertical.bar.type';
import {MultiSeries, Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";

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
  @Input() enableYAxis2: boolean = false;
  @Input() showXAxisLabel: boolean; // This shows a label under the X-axes ticks and tick labels.
  @Input() showYAxisLabel: boolean;
  @Input() showYAxisLabel2: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() yAxisLabel2: string;
  @Input() tooltipDisabled: boolean = false;
  @Input() scaleType: ScaleType = ScaleType.Ordinal;
  @Input() enableGradientEffectOnBars: boolean = false; // This enables a nice looking gradient on each bar strips
  @Input() showGridLines: boolean = true;
  @Input() showGridLines2: boolean = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: ScaleType;
  @Input() trimXAxisTicks: boolean = true; // This trims the label in the X-Axis, for example in an X-Axis of 'Australia', 'USA','UK', a trimmed X-Acis of maxXAxisTickLength=5 will be 'Austr..'
  @Input() maxXAxisTickLength: number = 16; // This value has no effect when trimXAxisTicks is set as false
  @Input() rotateXAxisTicks: boolean = false; // Enables the automatic rotation of x-axis ticks to prevent overlaps
  @Input() xAxisTickFormatting: (any) => string; // Pass in an arrow function which takes the data and returns a string
  @Input() yAxisTickFormatting: (any) => string; // Pass in an arrow function which takes the data and returns a string
  @Input() yAxisTickFormatting2: (any) => string; // Pass in an arrow function which takes the data and returns a string
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() yAxisTicks2: any[];
  @Input() groupPadding: number = 16; // This is the space between the grouped vertical bars
  @Input() barPadding: number = 0; // This is the space between vertical bars within the group
  @Input() roundDomains: boolean = false;
  @Input() roundEdges: boolean = true;
  @Input() yScaleMax: number;
  @Input() showDataLabel: boolean = false; // This shows the data at the top of every bar
  @Input() dataLabelFormatting: (any) => string; // Formats how the data at the top of every bar should appear. Pass in an arrow function which takes the data and returns a string.
  @Input() noBarWhenZero: boolean = true;
  @Input() showLegend: boolean = false; // Shows the legend
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Output() dataItemHoverEnter: EventEmitter<any> = new EventEmitter(); // Emits value when mouse hovers over a bar or a legend item
  @Output() dataItemHoverLeave: EventEmitter<any> = new EventEmitter(); // Emits value when mouse un-hovers over a bar or a legend item
  @Output() dataItemClick: EventEmitter<any> = new EventEmitter(); // Emits value when a bar or a legend item is clicked
  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  groupDomain: string[];
  innerDomain: string[];
  valueDomain: [number, number];
  valueDomain2: [number, number];
  groupScale: any;
  innerScale: any;
  valueScale: any;
  valueScale2: any;
  transform: string;
  colors: ColorHelper;
  margin: number[] = [10, 20, 10, 20];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  legendOptions: LegendOptions;
  dataLabelMaxHeight: any = { negative: 0, positive: 0 };
  barOrientation = BarOrientation;


  ngOnInit() {

  }

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
    this.groupDomain = this.getGroupDomain();
    this.innerDomain = this.getInnerDomain();
    this.valueDomain = this.getValueDomain();
    this.valueDomain2 = this.getValueDomain();
    this.groupScale = this.getGroupScale();
    this.innerScale = this.getInnerScale();
    this.valueScale = this.getYScale();
    // this.xScaleLine = this.getXScaleLine(this.xDomainLine, this.dims.width);
    this.valueScale2 = this.getYScale2();
    this.setColors();
    this.legendOptions = this.getLegendOptions();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0] + this.dataLabelMaxHeight.negative})`;
  }

  onDataLabelMaxHeightChanged(event, groupIndex: number): void {
    if (event.size.negative) {
      this.dataLabelMaxHeight.negative = Math.max(this.dataLabelMaxHeight.negative, event.size.height);
    } else {
      this.dataLabelMaxHeight.positive = Math.max(this.dataLabelMaxHeight.positive, event.size.height);
    }
    if (groupIndex === this.results.length - 1) {
      setTimeout(() => this.update());
    }
  }

  // getXScaleLine(domain, width): any {
  //   let scale;
  //   if (this.bandwidth === undefined) {
  //     this.bandwidth = width - this.barPadding;
  //   }
  //   const offset = Math.floor((width + this.barPadding - (this.bandwidth + this.barPadding) * domain.length) / 2);
  //
  //   if (this.scaleType === 'time') {
  //     scale = scaleTime().range([0, width]).domain(domain);
  //   } else if (this.scaleType === 'linear') {
  //     scale = scaleLinear().range([0, width]).domain(domain);
  //
  //     if (this.roundDomains) {
  //       scale = scale.nice();
  //     }
  //   } else if (this.scaleType === 'ordinal') {
  //     scale = scalePoint()
  //       .range([offset + this.bandwidth / 2, width - offset - this.bandwidth / 2])
  //       .domain(domain);
  //   }
  //   return scale;
  // }

  getGroupScale(): any {
    const spacing = this.groupDomain.length / (this.dims.height / this.groupPadding + 1);
    return scaleBand()
      .rangeRound([0, this.dims.width])
      .paddingInner(spacing)
      .paddingOuter(spacing / 2)
      .domain(this.groupDomain);
  }

  getInnerScale(): any {
    const width = this.groupScale.bandwidth();
    const spacing = this.innerDomain.length / (width / this.barPadding + 1);
    return scaleBand().rangeRound([0, width]).paddingInner(spacing).domain(this.innerDomain);
  }

  getYScale(): any {
    const scale = scaleLinear().range([this.dims.height, 0]).domain(this.valueDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getYScale2(): any {
    const scale = scaleLinear().range([this.dims.height, 0]).domain(this.valueDomain2);
    return this.roundDomains ? scale.nice() : scale;
  }

  getGroupDomain(): string[] {
    const domain = [];
    for (const group of this.results) {
      if (!domain.includes(group.label)) {
        domain.push(group.label);
      }
    }
    return domain;
  }

  getInnerDomain(): string[] {
    const domain = [];
    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.label)) {
          domain.push(d.label);
        }
      }
    }

    return domain;
  }

  getValueDomain(): [number, number] {
    const domain = [];
    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.value)) {
          domain.push(d.value);
        }
      }
    }
    const min = Math.min(0, ...domain);
    const max = this.yScaleMax ? Math.max(this.yScaleMax, ...domain) : Math.max(0, ...domain);
    return [min, max];
  }

  groupTransform(group: Series): string {
    return `translate(${this.groupScale(group.name)}, 0)`;
  }

  onClick(data, group?: Series): void {
    if (group) {
      data.series = group.name;
    }
    this.select.emit(data);
    this.dataItemClick.emit(data);
  }
  trackBy: TrackByFunction<Series> = (index: number, item: Series) => {
    return item.name;
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

  onDataItemHoverEnter(event, group: Series, fromLegend: boolean = false): void {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }
    const items = this.results
      .map(g => g.series)
      .flat()
      .filter(i => {
        if (fromLegend) {
          return i.label === item.name;
        } else {
          return i.name === item.name && i.series === item.series;
        }
      });
    this.activeEntries = [...items];
    this.dataItemHoverEnter.emit({ value: item, entries: this.activeEntries });
  }

  onDataItemHoverLeave(event, group: Series, fromLegend: boolean = false): void {
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
