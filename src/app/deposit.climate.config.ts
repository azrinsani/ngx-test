import {DepositClimateChartConfigType, DepositClimatePropertyEnumType} from "../shared/types/custom.chart.type";

export const depositClimateChartConfig: DepositClimateChartConfigType[] = [
  {
    name: 'Average Temperature (ANU)',
    s3Bucket: 'ga-eftf-downloads-nonprod',
    s3Key: 'climate-data/climate-data-average-temperature-monthly-anu.json',
    climateProperty: DepositClimatePropertyEnumType.AVERAGE_TEMPERATURE,
    provider: 'ANU'
  },
  // {
  //   name: 'Minimum Temperature (BOM)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-minimum-temperature-monthly-bom.json',
  //   climateProperty: DepositClimatePropertyEnumType.MINIMUM_TEMPERATURE,
  //   provider: 'BOM'
  // },
  // {
  //   name: 'Minimum Temperature (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-minimum-temperature-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.MINIMUM_TEMPERATURE,
  //   provider: 'ANU'
  // },
  // {
  //   name: 'Maximum Temperature (BOM)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-maximum-temperature-monthly-bom.json',
  //   climateProperty: DepositClimatePropertyEnumType.MAXIMUM_TEMPERATURE,
  //   provider: 'BOM'
  // },
  // {
  //   name: 'Maximum Temperature (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-maximum-temperature-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.MAXIMUM_TEMPERATURE,
  //   provider: 'ANU'
  // },
  // {
  //   name: 'Precipitation Total (BOM)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-precipitation-total-monthly-bom.json',
  //   climateProperty: DepositClimatePropertyEnumType.PRECIPITATION_TOTAL,
  //   provider: 'BOM'
  // },
  // {
  //   name: 'Vapour Pressure (H09) Mean (BOM)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-vapour-pressure-h09-monthly-bom.json',
  //   climateProperty: DepositClimatePropertyEnumType.VAPOUR_PRESSURE_H09,
  //   provider: 'BOM'
  // },
  // {
  //   name: 'Vapour Pressure (H15) Mean (BOM)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-vapour-pressure-h15-monthly-bom.json',
  //   climateProperty: DepositClimatePropertyEnumType.VAPOUR_PRESSURE_H15,
  //   provider: 'BOM'
  // },
  // {
  //   name: 'Vapour Pressure (VP) (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-vapour-pressure-vp-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.VAPOUR_PRESSURE_VP,
  //   provider: 'ANU'
  // },
  // {
  //   name: 'Vapour Pressure Deficit (APD) (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-vapour-pressure-deficit-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.VAPOUR_PRESSURE_DEFICIT,
  //   provider: 'ANU'
  // },
  // {
  //   name: 'Frost (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-frost-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.FROST,
  //   provider: 'ANU'
  // },
  // {
  //   name: 'Pan Evaporation (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-pan-evaporation-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.PAN_EVAPORATION,
  //   provider: 'ANU'
  // },
  // {
  //   name: 'Rainfall Occurrence (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-rainfall-occurrence-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.RAINFALL_OCCURRENCE,
  //   provider: 'ANU'
  // },
  // {
  //   name: 'Total Solar Radiation (SRad)  (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-total-solar-radiation-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.TOTAL_SOLAR_RADIATION,
  //   provider: 'ANU'
  // },
  // {
  //   name: 'Total Rainfall (ANU)',
  //   s3Bucket: 'ga-eftf-downloads-nonprod',
  //   s3Key: 'climate-data/climate-data-total-rainfall-monthly-anu.json',
  //   climateProperty: DepositClimatePropertyEnumType.TOTAL_RAINFALL,
  //   provider: 'ANU'
  // },
];
