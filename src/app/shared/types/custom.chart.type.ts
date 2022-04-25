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
export function isDate(value): boolean {
  return toString.call(value) === '[object Date]';
}

export function isNumber(value): boolean {
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
    const allDates = values.every(value => value instanceof Date);
    if (allDates) {
      return ScaleType.Time;
    }
  }
  const allNumbers = values.every(value => typeof value === 'number');
  if (allNumbers) {
    return ScaleType.Linear;
  }
  return ScaleType.Ordinal;
}

export enum BarOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal'
}
