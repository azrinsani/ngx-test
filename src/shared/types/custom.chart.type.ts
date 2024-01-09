import { ColorHelper } from '@swimlane/ngx-charts';
import { CustomLineChartDataType } from "../../app/custom-line-chart/custom.line.chart.component";

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

export interface DepositClimateChartConfigType {
  name: string;
  s3Bucket: string;
  s3Key: string;
  climateProperty: DepositClimatePropertyEnumType;
  provider: DepositProviderType;
}

export interface DepositClimateDataType {
  id: string;
  property: string;
  isMonthly: boolean;
  provider: DepositProviderType;
  values: Record<string, number>;
}

export type DepositProviderType = 'BOM' | 'ANU';

export interface DepositClimateChartDataType extends CustomLineChartDataType {
}

export enum DepositClimatePropertyEnumType {
  PERCIPITATION_CALIBRATED = 0,
  PRECIPITATION_TOTAL = 1,
  PRECIPITATION_WEIGHT = 2,
  MAXIMUM_TEMPERATURE = 3,
  MINIMUM_TEMPERATURE = 4,
  AVERAGE_TEMPERATURE = 5,
  VAPOUR_PRESSURE_H09 = 6,
  VAPOUR_PRESSURE_H15 = 7,
  VAPOUR_PRESSURE_VP = 8,
  VAPOUR_PRESSURE_DEFICIT = 9,
  FROST = 10,
  RAINFALL_OCCURRENCE = 11,
  PAN_EVAPORATION = 12,
  TOTAL_RAINFALL = 13,
  TOTAL_SOLAR_RADIATION = 14
}

