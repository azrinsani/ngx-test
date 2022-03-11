export enum ScaleType {
  Time = 'time',
  Linear = 'linear',
  Ordinal = 'ordinal',
  Quantile = 'quantile'
}

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

export enum BarOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal'
}
