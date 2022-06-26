import { ColorHelper } from '@swimlane/ngx-charts';

export enum LegendPosition {
  Right = 'right',
  Below = 'below'
}

export function isDate(value: any): value is Date {
  return toString.call(value) === '[object Date]';
}

export enum ScaleType {
  Time = 'time',
  Linear = 'linear',
  Ordinal = 'ordinal',
  Quantile = 'quantile'
}

export enum Orientation {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right'
}

// Returns  'time', 'linear' or 'ordinal'
export function getScaleType(values: any[], checkDateType: boolean = true): ScaleType {
  if (checkDateType) {
    const allDates: boolean = values.every(value => value instanceof Date);
    if (allDates) {
      return ScaleType.Time;
    }
  }
  const allNumbers: boolean = values.every(value => typeof value === 'number');
  if (allNumbers) {
    return ScaleType.Linear;
  }
  return ScaleType.Ordinal;
}

export interface CustomChartEmitType {
  value: number;
  entries: any[];
}

export interface LegendOptionType {
  scaleType: ScaleType;
  colors: ColorHelper;
  domain: any;
  title: string;
  position: LegendPosition;
}

export interface DataItemType {
  name: string | number | Date;
  value: number;
  extra?: any;
  min?: number;
  max?: number;
  label?: string;
}

export interface IVector2dType {
  v1: IPointType;
  v2: IPointType;
}

export interface IPointType {
  x: number;
  y: number;
}

export interface BoxPlotSeriesType {
  name: string | number | Date;
  series: DataItemType[];
}

export interface IBoxModelType {
  value: number | Date;
  label: string | number | Date;
  data: DataItemType[];
  formattedLabel: string;
  height: number;
  width: number;
  x: number;
  y: number;
  lineCoordinates: [IVector2dType, IVector2dType, IVector2dType, IVector2dType];
  quartiles: number[];
  tooltipText?: string;
  ariaLabel?: string;
  color?: string;
}

export type LineCoordinatesType = [IVector2dType, IVector2dType, IVector2dType, IVector2dType];

export enum BarOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal'
}
