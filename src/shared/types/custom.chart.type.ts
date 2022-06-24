import { ColorHelper } from "@swimlane/ngx-charts";

export interface LegendOptions {
  colors: any;
  domain: any[];
  position: LegendPosition;
  title: string;
  scaleType: ScaleType;
}

export enum LegendPosition {
  Right = 'right',
  Below = 'below'
}

export enum CustomChartType {
  ScaleLegend = 'scaleLegend',
  Legend = 'legend'
}
export function isDate(value: any): boolean {
  return toString.call(value) === '[object Date]';
}

export function isNumber(value: any): boolean {
  return typeof value === 'number';
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

export enum BarOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal'
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

export type StringOrNumberOrDate = string | number | Date;

export interface DataItem {
  name: StringOrNumberOrDate;
  value: number;
  extra?: any;
  min?: number;
  max?: number;
  label?: string;
}

export interface IVector2D {
  v1: IPoint;
  v2: IPoint;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface BoxChartSeries {
  name: StringOrNumberOrDate;
  series: DataItem[];
}

export interface BoxChartMultiSeries extends Array<BoxChartSeries> {}

export interface IBoxModel {
  value: number | Date;
  label: StringOrNumberOrDate;
  data: DataItem[];
  formattedLabel: string;
  height: number;
  width: number;
  x: number;
  y: number;
  lineCoordinates: [IVector2D, IVector2D, IVector2D, IVector2D];
  quartiles: number[];
  tooltipText?: string;
  ariaLabel?: string;
  color?: string;
}

export interface Gradient {
  offset: number;
  originalOffset?: number;
  color: string;
  opacity: number;
}

export type LineCoordinates = [IVector2D, IVector2D, IVector2D, IVector2D];
