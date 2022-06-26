import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { ColorHelper, formatLabel, PlacementTypes, StyleTypes, ViewDimensions } from '@swimlane/ngx-charts';
import { min, max, quantile } from 'd3-array';
import { ScaleLinear, ScaleBand } from 'd3-scale';
import { BoxPlotSeriesType, DataItemType, IBoxModelType, IVector2dType, ScaleType } from 'src/shared/types/custom.chart.type';

@Component({
  selector: 'g[ga-box-plot-series-chart-box-series]',
  template: `
    <svg:g
      ga-box-plot-series-chart-box
      [@animationState]="'active'"
      [@.disabled]="true"
      [width]="box.width"
      [height]="box.height"
      [x]="box.x"
      [y]="box.y"
      [boxHasRoundedEdges]="boxHasRoundedEdges"
      [fill]="boxColor"
      [boxColor]="boxColor"
      [boxWidth]="boxWidth"
      [data]="box"
      [lineCoordinates]="box.lineCoordinates"
      [ariaLabel]="box.ariaLabel"
      (select)="onClick($event)"
      (activate)="activate.emit($event)"
      (deactivate)="deactivate.emit($event)"
      ngx-tooltip
      [tooltipDisabled]="tooltipDisabled"
      [tooltipPlacement]="tooltipPlacement"
      [tooltipType]="tooltipType"
      [tooltipTitle]="tooltipTitle"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipContext]="box.data"
      [whiskerStrokeWidth]="whiskerStrokeWidth"
      [medianLineWidth]="medianLineWidth"
    ></svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CustomBoxPlotSeriesChartBoxSeriesComponent implements OnChanges {
  @Input() dims: ViewDimensions;
  @Input() series: BoxPlotSeriesType;
  @Input() xScale: ScaleBand<string>;
  @Input() yScale: ScaleLinear<number, number>;
  @Input() boxColor: string;
  @Input() strokeWidth: number;
  @Input() boxWidth: number;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() tooltipPlacement: PlacementTypes;
  @Input() tooltipType: StyleTypes;
  @Input() boxHasRoundedEdges: boolean;
  @Input() gradient: boolean = false;
  @Input() whiskerStrokeWidth: number;
  @Input() whiskerNotchLineWidth: number = 10;
  @Input() medianLineWidth: number;

  @Output() select: EventEmitter<IBoxModelType> = new EventEmitter();
  @Output() activate: EventEmitter<IBoxModelType> = new EventEmitter();
  @Output() deactivate: EventEmitter<IBoxModelType> = new EventEmitter();

  box: IBoxModelType;
  counts: DataItemType[];
  quartiles: [number, number, number];
  whiskers: [number, number];
  lineCoordinates: [IVector2dType, IVector2dType, IVector2dType, IVector2dType];
  tooltipTitle: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.updateTooltipSettings();
    const width: number = this.series && this.series.series.length ? Math.round(this.xScale.bandwidth()) : null;
    this.counts = this.series.series;
    const mappedCounts: number[] = this.counts.map(seriesItem => Number(seriesItem.value));
    this.whiskers = [min(mappedCounts), max(mappedCounts)];
    const groupCounts: number[] = this.counts.map(item => item.value).sort((a, b) => Number(a) - Number(b));
    this.quartiles = [quantile(groupCounts, 0.25), quantile(groupCounts, 0.5), quantile(groupCounts, 0.75)];
    this.lineCoordinates = this.getLinesCoordinates(this.series.name.toString(), this.whiskers, this.quartiles, width);
    const value: number = this.quartiles[1];
    const formattedLabel: string = formatLabel(this.series.name);
    const box: IBoxModelType = {
      value,
      data: this.counts,
      label: this.series.name,
      formattedLabel,
      width,
      height: 0,
      x: 0,
      y: 0,
      quartiles: this.quartiles,
      lineCoordinates: this.lineCoordinates
    };
    box.height = Math.abs(this.yScale(this.quartiles[0]) - this.yScale(this.quartiles[2]));
    box.x = this.xScale(this.series.name.toString());
    box.y = this.yScale(this.quartiles[2]);
    box.ariaLabel = formattedLabel + ' - Median: ' + value.toLocaleString();
    const tooltipLabel: string = formattedLabel;
    const formattedTooltipLabel: string = `
    <span class="tooltip-label">${this.escapeLabel(tooltipLabel)}</span>
    <span class="tooltip-val">
      • Q1: ${this.quartiles[0]} • Q2: ${this.quartiles[1]} • Q3: ${this.quartiles[2]}<br>
      • Min: ${this.whiskers[0]} • Max: ${this.whiskers[1]}
    </span>`;
    box.tooltipText = this.tooltipDisabled ? undefined : formattedTooltipLabel;
    this.tooltipTitle = this.tooltipDisabled ? undefined : box.tooltipText;
    this.box = box;
  }

  // When series is clicked on
  onClick(data: IBoxModelType): void {
    this.select.emit(data);
  }

  // Generate the 4 whisker lines
  getLinesCoordinates(seriesName: string, whiskers: [number, number], quartiles: [number, number, number], barWidth: number): [IVector2dType, IVector2dType, IVector2dType, IVector2dType] {
    const offsetX: number = this.xScale(seriesName) + barWidth / 2;
    const medianLineWidth: number = Math.max(barWidth + 4 * this.strokeWidth, 1);
    const whiskerZero: number = this.yScale(whiskers[0]);
    const whiskerOne: number = this.yScale(whiskers[1]);
    const median: number = this.yScale(quartiles[1]);
    const whiskerTopNotchLine: IVector2dType = {
      v1: { x: offsetX + this.whiskerNotchLineWidth / 2, y: whiskerZero },
      v2: { x: offsetX - this.whiskerNotchLineWidth / 2, y: whiskerZero }
    };
    const medianLine: IVector2dType = {
      v1: { x: offsetX + medianLineWidth / 2, y: median },
      v2: { x: offsetX - medianLineWidth / 2, y: median }
    };
    const whiskerBottomNotchLine: IVector2dType = {
      v1: { x: offsetX + this.whiskerNotchLineWidth / 2, y: whiskerOne },
      v2: { x: offsetX - this.whiskerNotchLineWidth / 2, y: whiskerOne }
    };
    const whiskerVerticalLine: IVector2dType = {
      v1: { x: offsetX, y: whiskerZero },
      v2: { x: offsetX, y: whiskerOne }
    };
    return [whiskerVerticalLine, whiskerTopNotchLine, medianLine, whiskerBottomNotchLine];
  }

  // Updates the tooltip settings during any changes
  updateTooltipSettings(): void {
    if (this.tooltipDisabled) {
      this.tooltipPlacement = undefined;
      this.tooltipType = undefined;
    } else {
      if (!this.tooltipPlacement) {
        this.tooltipPlacement = PlacementTypes.top;
      }
      if (!this.tooltipType) {
        this.tooltipType = StyleTypes.tooltip;
      }
    }
  }

  // Creates an escape string
  escapeLabel(label: string): string {
    return label.toLocaleString().replace(/[&'`"<>]/g, match => {
      return {
        '&': '&amp;',
        "'": '&#x27;',
        '`': '&#x60;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;'
      }[match];
    });
  }
}
