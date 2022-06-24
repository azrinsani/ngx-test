import { Component, Input, Output, EventEmitter, HostListener, ElementRef, SimpleChanges, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { select, BaseType } from 'd3-selection';
import { interpolate } from 'd3-interpolate';
import { easeSinInOut } from 'd3-ease';
import cloneDeep from 'clone-deep';
import { BarOrientation, Gradient, IBoxModel, IVector2D, LineCoordinates } from 'src/shared/types/custom.chart.type';

@Component({
  selector: 'g[ga-box-plot-series-chart-box]',
  template: `
    <svg:defs>
      <svg:mask [attr.id]="maskLineId">
        <svg:g>
          <rect height="100%" width="100%" fill="white" fill-opacity="1"/>
          <path class="bar" [attr.d]="boxPath" fill="black" fill-opacity="1"/>
        </svg:g>
      </svg:mask>
    </svg:defs>
    <svg:g>
      <!-- The Box-->
      <svg:path
        class="bar"
        role="img"
        tabIndex="-1"
        [class.active]="isActive"
        [class.hidden]="hideBar"
        [attr.d]="boxPath"
        [attr.stroke]="boxColor"
        [attr.stroke-width]="0"
        [attr.aria-label]="ariaLabel"
        [attr.fill]="fill"
        (click)="select.emit(data)"
      />
      <!-- The Box Line - There are 4 lines, 0: Vertical Line , 1: Bottom Bottom Notch Line, 2: Median Line, 4: Top Notch Line -->
      <svg:line
        *ngFor="let line of lineCoordinates; let i = index"
        class="bar-line"
        [class.hidden]="hideBar"
        [attr.x1]="line.v1.x"
        [attr.y1]="line.v1.y"
        [attr.x2]="line.v2.x"
        [attr.y2]="line.v2.y"
        [attr.stroke]="i === 2 ? medianLineColor : boxColor"
        [attr.stroke-width]="i === 2 ? medianLineWidth : whiskerStrokeWidth"
        [attr.mask]="undefined"
        fill="none"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomBoxPlotSeriesChartBoxComponent implements OnChanges {
  @Input() boxColor: string;
  @Input() medianLineColor: string = '#000000';
  @Input() fill: string;
  @Input() data: IBoxModel;
  @Input() width: number;
  @Input() height: number;
  @Input() x: number;
  @Input() y: number;
  @Input() lineCoordinates: LineCoordinates;
  @Input() boxHasRoundedEdges: boolean = true;
  @Input() offset: number = 0;
  @Input() isActive: boolean = false;
  @Input() ariaLabel: string;
  @Input() noBarWhenZero: boolean = true;
  @Input() whiskerStrokeWidth: number = 10;
  @Input() medianLineWidth: number = 10;
  @Input() boxWidth: number;

  @Output() select: EventEmitter<IBoxModel> = new EventEmitter();
  @Output() activate: EventEmitter<IBoxModel> = new EventEmitter();
  @Output() deactivate: EventEmitter<IBoxModel> = new EventEmitter();

  BarOrientation = BarOrientation;
  nativeElm: any;
  oldPath: string;
  boxPath: string;
  oldLineCoordinates: LineCoordinates;
  initialized: boolean = false;
  hideBar: boolean = false;
  maskLine: string;
  maskLineId: string;
  usedIds: string[] = [];

  constructor(element: ElementRef, protected cd: ChangeDetectorRef) {
    this.nativeElm = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      this.loadAnimation();
      this.initialized = true;
    } else {
      this.update();
    }
  }

  // Updates the Chart
  update(): void {
    this.updateLineElement();
    this.updatePathElement();
    this.hideBar = this.noBarWhenZero && this.height === 0;
    this.maskLineId = 'mask' + this.getNewId().toString();
    this.maskLine = `url(#${this.maskLineId})`;
    if (this.cd) {
      this.cd.markForCheck();
    }
  }

  // Loads the animation on change
  loadAnimation(): void {
    this.boxPath = this.oldPath = this.getStartingPath();
    this.oldLineCoordinates = [...this.lineCoordinates];
    setTimeout(this.update.bind(this), 100);
  }

  // Updates the Path Element during a chart update
  updatePathElement(): void {
    const nodeBar = select(this.nativeElm).selectAll('.bar');
    const path = this.getPath();
    nodeBar.attr('d', path);
    this.oldPath = path;
  }

  // Updates the Line Element during a chart update
  updateLineElement(): void {
    const lineEl = select(this.nativeElm).selectAll('.bar-line');
    const lineCoordinates = this.lineCoordinates;
    const oldLineCoordinates = this.oldLineCoordinates;
    lineEl
      .attr('x1', (_, index) => lineCoordinates[index].v1.x)
      .attr('y1', (_, index) => lineCoordinates[index].v1.y)
      .attr('x2', (_, index) => lineCoordinates[index].v2.x)
      .attr('y2', (_, index) => lineCoordinates[index].v2.y);
    this.oldLineCoordinates = [...lineCoordinates];
  }

  // Gets the starting path the animation
  getStartingPath(): string {
    return this.getPath();
  }

  // Returns the rectangle path
  getPath(): string {
    let radius = 0;
    if (this.boxHasRoundedEdges && this.height > 5 && this.width > 5) {
      radius = Math.floor(Math.min(5, this.height / 2, this.width / 2));
    }
    let edges: [boolean, boolean, boolean, boolean] = [false, false, false, false];
    if (this.boxHasRoundedEdges) {
      edges = [true, true, true, true];
    }
    let path = '';
    path = this.getRoundedRectanglePath(this.x, this.y, this.width, this.height, Math.min(this.height, radius), edges);
    return path;
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.activate.emit(this.data);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.deactivate.emit(this.data);
  }

  // Generates a short id. A 4-character alphanumeric sequence (364 = 1.6 million)
  private getNewId(): string {
    let newId: string = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
    newId = `a${newId}`;
    if (!this.usedIds[newId]) {
      this.usedIds[newId] = true;
      return newId;
    }
    return this.getNewId();
  }

  // Obtains the rounded Rectangle Path
  private getRoundedRectanglePath (x: number, y: number, w: number, h: number, r: number, [tl, tr, bl, br]: boolean[]): string {
    let returnValue: string = '';
    w = Math.floor(w);
    h = Math.floor(h);
    w = w === 0 ? 1 : w;
    h = h === 0 ? 1 : h;
    returnValue = `M${[x + r, y]}`;
    returnValue += `h${w - 2 * r}`;
    if (tr) {
      returnValue += `a${[r, r]} 0 0 1 ${[r, r]}`;
    } else {
      returnValue += `h${r}v${r}`;
    }
    returnValue += `v${h - 2 * r}`;
    if (br) {
      returnValue += `a${[r, r]} 0 0 1 ${[-r, r]}`;
    } else {
      returnValue += `v${r}h${-r}`;
    }
    returnValue += `h${2 * r - w}`;
    if (bl) {
      returnValue += `a${[r, r]} 0 0 1 ${[-r, -r]}`;
    } else {
      returnValue += `h${-r}v${-r}`;
    }
    returnValue += `v${2 * r - h}`;
    if (tl) {
      returnValue += `a${[r, r]} 0 0 1 ${[r, -r]}`;
    } else {
      returnValue += `v${-r}h${r}`;
    }
    returnValue += `z`;
    return returnValue;
  }
}
