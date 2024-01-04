import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ColorHelper, formatLabel, id, StyleTypes } from '@swimlane/ngx-charts';

@Component({
  // eslint-disable-next-line
  selector: 'g[ga-ngx-charts-circle-series]',
  template: `
    <svg:g *ngIf="circle">
      <defs>
        <svg:g
          ngx-charts-svg-linear-gradient
          orientation="vertical"
          [name]="gradientId"
          [stops]="circle.gradientStops"
        />
      </defs>
      <svg:rect
        *ngIf="barVisible && type === 'standard'"
        [@animationState]="'active'"
        [attr.x]="circle.cx - circle.radius"
        [attr.y]="circle.cy"
        [attr.width]="circle.radius * 2"
        [attr.height]="circle.height"
        [attr.fill]="gradientFill"
        class="tooltip-bar"
      />
      <svg:g
        ngx-charts-circle
        class="circle"
        [cx]="circle.cx"
        [cy]="circle.cy"
        [r]="circle.radius"
        [fill]="circle.color"
        [class.active]="isActive({name: circle.seriesName})"
        [pointerEvents]="'all'"
        [data]="circle.value"
        [classNames]="circle.classNames"
        (select)="onClick($event, circle.label)"
        (activate)="activateCircle()"
        (deactivate)="deactivateCircle()"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="tooltipPlacement"
        [tooltipType]="StyleTypes.tooltip"
        [tooltipTitle]="tooltipTemplate ? undefined : getTooltipText(circle)"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipContext]="circle.data"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate(250, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CustomCircleSeriesComponent implements OnChanges, OnInit {
  @Input() data: any;
  @Input() type: string = 'standard';
  @Input() xScale: any;
  @Input() yScale: any;
  @Input() colors: ColorHelper;
  @Input() scaleType: string;
  @Input() visibleValue: any;
  @Input() activeEntries: any[];
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() selectEvent: EventEmitter<any> = new EventEmitter();
  @Output() activateEvent: EventEmitter<any> = new EventEmitter();
  @Output() deactivateEvent: EventEmitter<any> = new EventEmitter();

  StyleTypes: typeof StyleTypes = StyleTypes;
  // This is a workaround until ngx-charts adds the PlacementTypes type to the public API.
  tooltipPlacement: any = 'top';

  areaPath: any;
  circle: any; // Active circle
  barVisible: boolean = false;
  gradientId: string;
  gradientFill: string;

  ngOnInit(): void {
    this.gradientId = 'grad' + id().toString();
    this.gradientFill = `url(#${this.gradientId})`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.circle = this.getActiveCircle();
  }

  getActiveCircle(): {} {
    const indexActiveDataPoint: number = this.data.series.findIndex(d => {
      const label: any = d.name;
      return label && this.visibleValue && label.toString() === this.visibleValue.x.toString() && d.value !== undefined;
    });

    if (indexActiveDataPoint === -1) {
      // No valid point is 'active/hovered over' at this moment.
      return undefined;
    }

    return this.mapDataPointToCircle(this.data.series[indexActiveDataPoint], indexActiveDataPoint);
  }

  mapDataPointToCircle(d: any, i: number): any {
    const seriesName: any = this.data.name;

    const value: any = d.value;
    const label: any = d.name;
    const tooltipLabel: string = formatLabel(label);

    let cx: any;
    if (this.scaleType === 'time') {
      cx = this.xScale(label);
    } else if (this.scaleType === 'linear') {
      cx = this.xScale(Number(label));
    } else {
      cx = this.xScale(label);
    }

    const cy: any = this.yScale(this.type === 'standard' ? value : d.d1);
    const radius: number = 5;
    const height: number = this.yScale.range()[0] - cy;
    const opacity: number = 1;

    let color: any;
    if (this.colors.scaleType === 'linear') {
      if (this.type === 'standard') {
        color = this.colors.getColor(value);
      } else {
        color = this.colors.getColor(d.d1);
      }
    } else {
      color = this.colors.getColor(seriesName);
    }

    const data: any = {
      series: seriesName,
      value,
      name: label,
      stdev: d.stdev
    };

    return {
      classNames: [`circle-data-${i}`],
      value,
      label,
      data,
      cx,
      cy,
      radius,
      height,
      tooltipLabel,
      color,
      opacity,
      seriesName,
      gradientStops: this.getGradientStops(color),
      min: d.min,
      max: d.max
    };
  }

  getTooltipText({ tooltipLabel, value, seriesName, min, max }: any): string {
    return `
      <span class="tooltip-label">${seriesName} • ${tooltipLabel}</span>
      <span class="tooltip-val">${value.toLocaleString()}${this.getTooltipMinMaxText(min, max)}</span>
    `;
  }

  getTooltipMinMaxText(min: any, max: any): string {
    if (min !== undefined || max !== undefined) {
      let result: string = ' (';
      if (min !== undefined) {
        if (max === undefined) {
          result += '≥';
        }
        result += min.toLocaleString();
        if (max !== undefined) {
          result += ' - ';
        }
      } else if (max !== undefined) {
        result += '≤';
      }
      if (max !== undefined) {
        result += max.toLocaleString();
      }
      result += ')';
      return result;
    } else {
      return '';
    }
  }

  getGradientStops(color: any): any[] {
    return [
      {
        offset: 0,
        color,
        opacity: 0.2
      },
      {
        offset: 100,
        color,
        opacity: 1
      }
    ];
  }

  onClick(value: any, label: any): void {
    this.selectEvent.emit({
      name: label,
      value
    });
  }

  isActive(entry: any): boolean {
    if (!this.activeEntries) {
      return false;
    }
    const item: any = this.activeEntries.find(d => {
      return entry.name === d.name;
    });
    return item !== undefined;
  }

  activateCircle(): void {
    this.barVisible = true;
    this.activateEvent.emit({ name: this.data.name });
  }

  deactivateCircle(): void {
    this.barVisible = false;
    this.circle.opacity = 0;
    this.deactivateEvent.emit({ name: this.data.name });
  }
}
