import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { StyleTypes } from '@swimlane/ngx-charts';

@Component({
  // eslint-disable-next-line
  selector: 'g[ga-ngx-charts-tooltip-area]',
  template: `
    <svg:g>
      <svg:rect
        class="tooltip-area"
        [attr.x]="0"
        y="0"
        [attr.width]="dims.width"
        [attr.height]="dims.height"
        style="opacity: 0; cursor: 'auto';"
        (mousemove)="mouseMove($event)"
        (mouseleave)="hideTooltip()"
      />
      <xhtml:ng-template #defaultTooltipTemplate let-model="model">
        <xhtml:div class="area-tooltip-container">
          <xhtml:div *ngFor="let tooltipItem of model" class="tooltip-item">
            <span class="tooltip-item-color" [style.background-color]="tooltipItem.color"></span>
            {{getToolTipText(tooltipItem)}}
          </xhtml:div>
        </xhtml:div>
      </xhtml:ng-template>
      <svg:rect
        #tooltipAnchor
        [@animationState]="anchorOpacity !== 0 ? 'active' : 'inactive'"
        class="tooltip-anchor"
        [attr.x]="anchorPosX"
        [attr.y]="anchorPosY"
        [attr.width]="1"
        [attr.height]="dims.height"
        [style.opacity]="anchorOpacity"
        [style.pointer-events]="'none'"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="tooltipPlacement"
        [tooltipType]="StyleTypes.tooltip"
        [tooltipSpacing]="15"
        [tooltipTemplate]="tooltipTemplate ? tooltipTemplate: defaultTooltipTemplate"
        [tooltipContext]="anchorValues"
        [tooltipImmediateExit]="true"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition('inactive => active', [
        style({
          opacity: 0,
        }),
        animate(250, style({ opacity: 0.7 }))
      ]),
      transition('active => inactive', [
        style({
          opacity: 0.7,
        }),
        animate(250, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CustomTooltipAreaComponent {
  anchorOpacity: number = 0;
  anchorPosX: number = -1;
  anchorPosY: number = -1;
  anchorValues: any[] = [];
  lastAnchorPosX: number;
  lastAnchorPosY: number;

  @Input() dims: any;
  @Input() xSet: any;
  @Input() xScale: any;
  @Input() yScale: any;
  @Input() results: any[];
  @Input() colors: any;
  @Input() showPercentage: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() hover: EventEmitter<any> = new EventEmitter();

  @ViewChild('tooltipAnchor', { static: true }) tooltipAnchor: ElementRef;

  StyleTypes: typeof StyleTypes = StyleTypes;
  // This is a workaround until ngx-charts adds the PlacementTypes type to the public API.
  tooltipPlacement: any = 'right';

  getValues(xVal: number, yVal: number): any[] {
    const results: any[] = [];

    for (const group of this.results) {
      const item: any = group.series.find(d => d.name.toString() === xVal.toString() && d.value.toString() === yVal.toString());
      let groupName: any = group.name;
      if (groupName instanceof Date) {
        groupName = groupName.toLocaleDateString();
      }

      if (item) {
        const label: any = item.name;
        let val: any = item.value;
        if (this.showPercentage) {
          val = (item.d1 - item.d0).toFixed(2) + '%';
        }
        let color: any;
        if (this.colors.scaleType === 'linear') {
          let v: any = val;
          if (item.d1) {
            v = item.d1;
          }
          color = this.colors.getColor(v);
        } else {
          color = this.colors.getColor(group.name);
        }

        results.push({
          value: val,
          name: label,
          series: groupName,
          min: item.min,
          max: item.max,
          color
        });
      }
    }

    return results;
  }

  mouseMove(event: MouseEvent): void {
    const series: any[] = this.results[0].series;

    const xPos: number = event.pageX - (<Element>event.target).getBoundingClientRect().left;
    const yPos: number = event.pageY - (<Element>event.target).getBoundingClientRect().top;

    const closestIndex: number = this.findClosestPointIndex(xPos, yPos);
    const closestPoint: any = series[closestIndex];
    this.anchorPosX = this.xScale(closestPoint.name);
    this.anchorPosX = Math.max(0, this.anchorPosX);
    this.anchorPosX = Math.min(this.dims.width, this.anchorPosX);
    this.anchorPosY = this.yScale(closestPoint.value);
    this.anchorPosY = Math.max(0, this.anchorPosY);
    this.anchorPosY = Math.min(this.dims.width, this.anchorPosY);

    this.anchorValues = this.getValues(closestPoint.name, closestPoint.value);
    if (this.anchorPosX !== this.lastAnchorPosX || this.anchorPosY !== this.lastAnchorPosY) {
      const ev: MouseEvent = new MouseEvent('mouseleave', { bubbles: false });
      this.tooltipAnchor.nativeElement.dispatchEvent(ev);
      this.anchorOpacity = 0.7;
      this.hover.emit({
        value: {
          x: closestPoint.name,
          y: closestPoint.value
        }
      });
      this.showTooltip();

      this.lastAnchorPosX = this.anchorPosX;
      this.lastAnchorPosY = this.anchorPosY;
    }
  }

  findClosestPointIndex(xPos: number, yPos: number): number {
    const series: any[] = this.results[0].series;
    let closestIndex: number = 0;

    for (let currentIndex: number = 1; currentIndex < series.length; currentIndex++) {
      const closestXPos: number = this.xScale(series[closestIndex].name);
      const closestYPos: number = this.yScale(series[closestIndex].value);
      const indexXPos: number = this.xScale(series[currentIndex].name);
      const indexYPos: number = this.yScale(series[currentIndex].value);
      const closestDifference: number = Math.abs(xPos - closestXPos) + Math.abs(yPos - closestYPos);
      const indexDifference: number = Math.abs(xPos - indexXPos) + Math.abs(yPos - indexYPos);
      if (indexDifference < closestDifference) {
        closestIndex = currentIndex;
      }
    }

    return closestIndex;
  }

  showTooltip(): void {
    const event: MouseEvent = new MouseEvent('mouseenter', { bubbles: false });
    this.tooltipAnchor.nativeElement.dispatchEvent(event);
  }

  hideTooltip(): void {
    const event: MouseEvent = new MouseEvent('mouseleave', { bubbles: false });
    this.tooltipAnchor.nativeElement.dispatchEvent(event);
    this.anchorOpacity = 0;
    this.lastAnchorPosX = -1;
    this.lastAnchorPosY = -1;
  }

  getToolTipText(tooltipItem: any): string {
    let result: string = '';
    if (tooltipItem.series !== undefined) {
      result += tooltipItem.series;
    } else {
      result += '???';
    }
    result += ': ';
    // Custom - changed tooltipItem.value to tooltipItem.name, to have the tooltip display x axis values instead of y axis values
    if (tooltipItem.name !== undefined) {
      result += tooltipItem.name.toLocaleString();
    }
    if (tooltipItem.min !== undefined || tooltipItem.max !== undefined) {
      result += ' (';
      if (tooltipItem.min !== undefined) {
        if (tooltipItem.max === undefined) {
          result += '≥';
        }
        result += tooltipItem.min.toLocaleString();
        if (tooltipItem.max !== undefined) {
          result += ' - ';
        }
      } else if (tooltipItem.max !== undefined) {
        result += '≤';
      }
      if (tooltipItem.max !== undefined) {
        result += tooltipItem.max.toLocaleString();
      }
      result += ')';
    }
    return result;
  }
}
