import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { area, line } from 'd3-shape';
import { id, sortByDomain, sortByTime } from '@swimlane/ngx-charts';
import {ArrayUtilsCommon} from "../utils/array/array.utils";

@Component({
  // eslint-disable-next-line
  selector: 'g[ga-ngx-charts-line-series]',
  template: `
    <svg:g>
      <defs>
        <svg:g
          ngx-charts-svg-linear-gradient *ngIf="hasGradient"
          orientation="vertical"
          [name]="gradientId"
          [stops]="gradientStops"
        />
      </defs>
      <svg:g
        ngx-charts-area
        class="line-highlight"
        [data]="data"
        [path]="areaPath"
        [fill]="hasGradient ? gradientUrl : colors.getColor(data.name)"
        [opacity]="0.25"
        [startOpacity]="0"
        [gradient]="true"
        [stops]="areaGradientStops"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
        [animations]="animations"
      />
      <svg:g
        ngx-charts-line
        class="line-series"
        [data]="data"
        [path]="path"
        [stroke]="stroke"
        [animations]="animations"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
      />
      <svg:g
        ngx-charts-area
        *ngIf="hasRange"
        class="line-series-range"
        [data]="data"
        [path]="outerPath"
        [fill]="hasGradient ? gradientUrl : colors.getColor(data.name)"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
        [opacity]="rangeFillOpacity"
        [animations]="animations"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomLineSeriesComponent implements OnChanges {
  @Input() data: any;
  @Input() xScale: any;
  @Input() yScale: any;
  @Input() colors: any;
  @Input() scaleType: string;
  @Input() curve: any;
  @Input() activeEntries: any[];
  @Input() rangeFillOpacity: number;
  @Input() hasRange: boolean;
  @Input() animations: boolean = true;

  path: string;
  outerPath: string;
  areaPath: string;
  gradientId: string;
  gradientUrl: string;
  hasGradient: boolean;
  gradientStops: any[];
  areaGradientStops: any[];
  stroke: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.updateGradients();

    const data: any[] = this.sortData(this.data.series);

    const lineGen: any = this.getLineGenerator();
    this.path = lineGen(data) || '';

    const areaGen: any = this.getAreaGenerator();
    this.areaPath = areaGen(data) || '';

    if (this.hasRange) {
      const range: any = this.getRangeGenerator();
      this.outerPath = range(data) || '';
    }

    if (this.hasGradient) {
      this.stroke = this.gradientUrl;
      const values: any[] = this.data.series.map(d => d.value);
      const [min, max]: [number, number] = ArrayUtilsCommon.getMinMax(values);
      if (max === min) {
        this.stroke = this.colors.getColor(max);
      }
    } else {
      this.stroke = this.colors.getColor(this.data.name);
    }
  }

  getLineGenerator(): any {
    return line<any>()
      .x(d => {
        const label: any = d.name;
        let value: any;
        if (this.scaleType === 'time') {
          value = this.xScale(label);
        } else if (this.scaleType === 'linear' || this.scaleType === 'log') {
          value = this.xScale(Number(label));
        } else {
          value = this.xScale(label);
        }
        return value;
      })
      .y(d => this.yScale(d.value))
      .curve(this.curve);
  }

  getRangeGenerator(): any {
    return area<any>()
      .y(d => {
        const label: any = d.value;
        let value: any;
        if (this.scaleType === 'time') {
          value = this.yScale(label);
        } else if (this.scaleType === 'linear' || this.scaleType === 'log') {
          value = this.yScale(Number(label));
        } else {
          value = this.yScale(label);
        }
        return value;
      })
      .x0(d => this.xScale(typeof d.min === 'number' ? d.min : d.name))
      .x1(d => this.xScale(typeof d.max === 'number' ? d.max : d.name))
      .curve(this.curve);
  }

  getAreaGenerator(): any {
    const xProperty: any = (d) => {
      const label: any = d.name;
      return this.xScale(label);
    };

    return area<any>()
      .x(xProperty)
      .y0(() => this.yScale.range()[0])
      .y1(d => this.yScale(d.value))
      .curve(this.curve);
  }

  sortData(data: any): any {
    if (this.scaleType === 'linear' || this.scaleType === 'log') {
    } else if (this.scaleType === 'time') {
      data = sortByTime(data, 'name');
    } else {
      data = sortByDomain(data, 'name', 'asc', this.xScale.domain());
    }

    return data;
  }

  updateGradients(): void {
    if (this.colors.scaleType === 'linear' || this.colors.scaleType === 'log') {
      this.hasGradient = true;
      this.gradientId = 'grad' + id().toString();
      this.gradientUrl = `url(#${this.gradientId})`;
      const values: any[] = this.data.series.map(d => d.value);
      const [min, max]: [number, number] = ArrayUtilsCommon.getMinMax(values);
      this.gradientStops = this.colors.getLinearGradientStops(max, min);
      this.areaGradientStops = this.colors.getLinearGradientStops(max);
    } else {
      this.hasGradient = false;
      this.gradientStops = undefined;
      this.areaGradientStops = undefined;
    }
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

  isInactive(entry: any): boolean {
    if (!this.activeEntries || this.activeEntries.length === 0) {
      return false;
    }
    const item: any = this.activeEntries.find(d => {
      return entry.name === d.name;
    });
    return item === undefined;
  }
}
