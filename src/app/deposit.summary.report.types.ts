export interface DepositSummaryReportConfigType {
  uuid: string;
  templates: TemplateType[];
}

export interface PhotoGraphType {
  loading: boolean;
  error: string;
  photos: PhotoType[];
}

export interface PhotoType {
  name: string;
  caption: string;
  originator: string;
  url: string;
}

export interface BasicGroupType {
  id: string;
  name: string;
  collapsed: boolean;
}

export interface PhotoGroupType extends BasicGroupType {
  photos: boolean;
  eno: string;
  layer: string;
  url: string;
}

export interface TemplateType {
  id: string;
  templateName: string;
  groups: TemplateGroupType[];
}

export interface TemplateGroupType {
  id: 'overview' | 'overview_location_map' | 'resources_and_reserves' | 'tenements' | 'geology' | 'geochemistry' | 'geophysics' | 'boreholes' | 'photos';
  name: string;
  hasMap: boolean;
  photos: boolean;
  collapsed: boolean;
}

export interface DepositSummaryReportFeatureType {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  geometry_name: string;
  properties: DepositSummaryReportType | DepositSummaryGeochemistryFeaturePropertiesType;
  bbox: number[];
}

export interface DepositSummaryGeochemistryFeaturePropertiesType {
  DEPOSIT_UID: string;
  DEPOSIT_NAME: string;
  DEPOSIT_LOCAL_ID: string;
  DEPOSIT_ENVIRONMENT: string;
  DEPOSIT_GROUP: string;
  DEPOSIT_TYPE: string;
  PRIMARY_COMMODITIES: string;
  SECONDARY_COMMODITIES: string;
  ALL_COMMODITIES: string;
  DEPOSIT_SOURCE: string;
  SAMPLE_UID: string;
  SAMPLE_NAME: string;
  SAMPLE_LOCAL_ID: string;
  FEATURE_TYPE: string;
  FEATURE_NAME: string;
  FEATURE_UID: string;
  TOP_DEPTH_M: any;
  BASE_DEPTH_M: any;
  SAMPLE_DEPOSIT_RELATION: string;
  SAMPLE_TYPE: string;
  SAMPLING_METHOD: string;
  MATERIAL_CLASS: string;
  PROVINCE: any;
  STRAT_UNIT_NAME: any;
  STRAT_UNIT_UID: any;
  STRAT_GROUPING: any;
  EARTH_MATERIAL_GROUP: string;
  EARTH_MATERIAL_QUALIFIER: any;
  EARTH_MATERIAL: string;
  MODE_OCCURRENCE: any;
  ALTERATION: any;
  TEXTURE: any;
  MINERALS: string;
  SAMPLE_DESCRIPTION: string;
  SAMPLE_PREPARATION: string;
  SIO2_WT_PERCENT: number;
  SIO2_DETECTION_LIMIT: number;
  SIO2_METHOD: string;
  TIO2_WT_PERCENT: number;
  TIO2_DETECTION_LIMIT: number;
  TIO2_METHOD: string;
  AL2O3_WT_PERCENT: number;
  AL2O3_DETECTION_LIMIT: number;
  AL2O3_METHOD: string;
  FE2O3TOT_WT_PERCENT: number;
  FE2O3TOT_DETECTION_LIMIT: number;
  FE2O3TOT_METHOD: string;
  FE2O3_WT_PERCENT: number;
  FE2O3_DETECTION_LIMIT: number;
  FE2O3_METHOD: string;
  FEO_WT_PERCENT: number;
  FEO_DETECTION_LIMIT: number;
  FEO_METHOD: string;
  MNO_WT_PERCENT: number;
  MNO_DETECTION_LIMIT: number;
  MNO_METHOD: string;
  MGO_WT_PERCENT: number;
  MGO_DETECTION_LIMIT: number;
  MGO_METHOD: string;
  CAO_WT_PERCENT: number;
  CAO_DETECTION_LIMIT: number;
  CAO_METHOD: string;
  NA2O_WT_PERCENT: number;
  NA2O_DETECTION_LIMIT: number;
  NA2O_METHOD: string;
  K2O_WT_PERCENT: number;
  K2O_DETECTION_LIMIT: number;
  K2O_METHOD: string;
  P2O5_WT_PERCENT: number;
  P2O5_DETECTION_LIMIT: number;
  P2O5_METHOD: string;
  H2OPLUS_WT_PERCENT: number;
  H2OPLUS_DETECTION_LIMIT: number;
  H2OPLUS_METHOD: string;
  H2OMINUS_WT_PERCENT: number;
  H2OMINUS_DETECTION_LIMIT: number;
  H2OMINUS_METHOD: string;
  H2OTOTAL_WT_PERCENT: number;
  H2OTOTAL_DETECTION_LIMIT: number;
  H2OTOTAL_METHOD: string;
  CO2_WT_PERCENT: number;
  CO2_DETECTION_LIMIT: number;
  CO2_METHOD: string;
  SO3_WT_PERCENT: number;
  SO3_DETECTION_LIMIT: number;
  SO3_METHOD: string;
  MLOI_WT_PERCENT: number;
  MLOI_DETECTION_LIMIT: number;
  MLOI_METHOD: string;
  LOITOT_WT_PERCENT: number;
  LOITOT_DETECTION_LIMIT: number;
  LOITOT_METHOD: string;
  REST_WT_PERCENT: number;
  REST_METHOD: string;
  TOTAL_WT_PERCENT: number;
  TOTAL_METHOD: string;
  AG_PPM: number;
  AG_DETECTION_LIMIT: number;
  AG_METHOD: string;
  AL_PPM: number;
  AL_DETECTION_LIMIT: number;
  AL_METHOD: string;
  AS_PPM: number;
  AS_DETECTION_LIMIT: number;
  AS_METHOD: string;
  AU_PPB: number;
  AU_DETECTION_LIMIT: number;
  AU_METHOD: string;
  B_PPM: number;
  B_DETECTION_LIMIT: number;
  B_METHOD: string;
  BA_PPM: number;
  BA_DETECTION_LIMIT: number;
  BA_METHOD: string;
  BE_PPM: number;
  BE_DETECTION_LIMIT: number;
  BE_METHOD: string;
  BI_PPM: number;
  BI_DETECTION_LIMIT: number;
  BI_METHOD: string;
  BR_PPM: number;
  BR_DETECTION_LIMIT: number;
  BR_METHOD: string;
  C_WT_PERCENT: number;
  C_DETECTION_LIMIT: number;
  C_METHOD: string;
  CA_PPM: number;
  CA_DETECTION_LIMIT: number;
  CA_METHOD: string;
  CD_PPM: number;
  CD_DETECTION_LIMIT: number;
  CD_METHOD: string;
  CE_PPM: number;
  CE_DETECTION_LIMIT: number;
  CE_METHOD: string;
  CL_PPM: number;
  CL_DETECTION_LIMIT: number;
  CL_METHOD: string;
  CO_PPM: number;
  CO_DETECTION_LIMIT: number;
  CO_METHOD: string;
  CR_PPM: number;
  CR_DETECTION_LIMIT: number;
  CR_METHOD: string;
  CS_PPM: number;
  CS_DETECTION_LIMIT: number;
  CS_METHOD: string;
  CU_PPM: number;
  CU_DETECTION_LIMIT: number;
  CU_METHOD: string;
  DY_PPM: number;
  DY_DETECTION_LIMIT: number;
  DY_METHOD: string;
  ER_PPM: number;
  ER_DETECTION_LIMIT: number;
  ER_METHOD: string;
  EU_PPM: number;
  EU_DETECTION_LIMIT: number;
  EU_METHOD: string;
  F_PPM: number;
  F_DETECTION_LIMIT: number;
  F_METHOD: string;
  FE_PPM: number;
  FE_DETECTION_LIMIT: number;
  FE_METHOD: string;
  GA_PPM: number;
  GA_DETECTION_LIMIT: number;
  GA_METHOD: string;
  GD_PPM: number;
  GD_DETECTION_LIMIT: number;
  GD_METHOD: string;
  GE_PPM: number;
  GE_DETECTION_LIMIT: number;
  GE_METHOD: string;
  HF_PPM: number;
  HF_DETECTION_LIMIT: number;
  HF_METHOD: string;
  HG_PPB: number;
  HG_DETECTION_LIMIT: number;
  HG_METHOD: string;
  HO_PPM: number;
  HO_DETECTION_LIMIT: number;
  HO_METHOD: string;
  IN_PPM: number;
  IN_DETECTION_LIMIT: number;
  IN_METHOD: string;
  IR_PPM: number;
  IR_DETECTION_LIMIT: number;
  IR_METHOD: string;
  K_PPM: number;
  K_DETECTION_LIMIT: number;
  K_METHOD: string;
  LA_PPM: number;
  LA_DETECTION_LIMIT: number;
  LA_METHOD: string;
  LI_PPM: number;
  LI_DETECTION_LIMIT: number;
  LI_METHOD: string;
  LU_PPM: number;
  LU_DETECTION_LIMIT: number;
  LU_METHOD: string;
  MG_PPM: number;
  MG_DETECTION_LIMIT: number;
  MG_METHOD: string;
  MN_PPM: number;
  MN_DETECTION_LIMIT: number;
  MN_METHOD: string;
  MO_PPM: number;
  MO_DETECTION_LIMIT: number;
  MO_METHOD: string;
  NA_PPM: number;
  NA_DETECTION_LIMIT: number;
  NA_METHOD: string;
  NB_PPM: number;
  NB_DETECTION_LIMIT: number;
  NB_METHOD: string;
  ND_PPM: number;
  ND_DETECTION_LIMIT: number;
  ND_METHOD: string;
  NI_PPM: number;
  NI_DETECTION_LIMIT: number;
  NI_METHOD: string;
  OS_PPB: number;
  OS_DETECTION_LIMIT: number;
  OS_METHOD: string;
  P_PPM: number;
  P_DETECTION_LIMIT: number;
  P_METHOD: string;
  PB_PPM: number;
  PB_DETECTION_LIMIT: number;
  PB_METHOD: string;
  PD_PPB: number;
  PD_DETECTION_LIMIT: number;
  PD_METHOD: string;
  PR_PPM: number;
  PR_DETECTION_LIMIT: number;
  PR_METHOD: string;
  PT_PPB: number;
  PT_DETECTION_LIMIT: number;
  PT_METHOD: string;
  RB_PPM: number;
  RB_DETECTION_LIMIT: number;
  RB_METHOD: string;
  RE_PPB: number;
  RE_DETECTION_LIMIT: number;
  RE_METHOD: string;
  RH_PPB: number;
  RH_DETECTION_LIMIT: number;
  RH_METHOD: string;
  RU_PPB: number;
  RU_DETECTION_LIMIT: number;
  RU_METHOD: string;
  S_PPM: number;
  S_DETECTION_LIMIT: number;
  S_METHOD: string;
  SB_PPM: number;
  SB_DETECTION_LIMIT: number;
  SB_METHOD: string;
  SC_PPM: number;
  SC_DETECTION_LIMIT: number;
  SC_METHOD: string;
  SE_PPM: number;
  SE_DETECTION_LIMIT: number;
  SE_METHOD: string;
  SI_PPM: number;
  SI_DETECTION_LIMIT: number;
  SI_METHOD: string;
  SM_PPM: number;
  SM_DETECTION_LIMIT: number;
  SM_METHOD: string;
  SN_PPM: number;
  SN_DETECTION_LIMIT: number;
  SN_METHOD: string;
  SR_PPM: number;
  SR_DETECTION_LIMIT: number;
  SR_METHOD: string;
  TA_PPM: number;
  TA_DETECTION_LIMIT: number;
  TA_METHOD: string;
  TB_PPM: number;
  TB_DETECTION_LIMIT: number;
  TB_METHOD: string;
  TE_PPM: number;
  TE_DETECTION_LIMIT: number;
  TE_METHOD: string;
  TH_PPM: number;
  TH_DETECTION_LIMIT: number;
  TH_METHOD: string;
  TI_PPM: number;
  TI_DETECTION_LIMIT: number;
  TI_METHOD: string;
  TL_PPM: number;
  TL_DETECTION_LIMIT: number;
  TL_METHOD: string;
  TM_PPM: number;
  TM_DETECTION_LIMIT: number;
  TM_METHOD: string;
  U_PPM: number;
  U_DETECTION_LIMIT: number;
  U_METHOD: string;
  V_PPM: number;
  V_DETECTION_LIMIT: number;
  V_METHOD: string;
  W_PPM: number;
  W_DETECTION_LIMIT: number;
  W_METHOD: string;
  Y_PPM: number;
  Y_DETECTION_LIMIT: number;
  Y_METHOD: string;
  YB_PPM: number;
  YB_DETECTION_LIMIT: number;
  YB_METHOD: string;
  ZN_PPM: number;
  ZN_DETECTION_LIMIT: number;
  ZN_METHOD: string;
  ZR_PPM: number;
  ZR_DETECTION_LIMIT: number;
  ZR_METHOD: string;
  LREE_PPM: number;
  HREE_PPM: number;
  REE_PPM: number;
  REE_Y_PPM: number;
  ANALYSIS_DATETIME: string;
  SUBMITTER: string;
  SAMPLE_SOURCE: string;
  COUNTRY: string;
  STATE: string;
  DEPOSIT_LONGITUDE_WGS84: number;
  DEPOSIT_LATITUDE_WGS84: number;
  SAMPLE_LONGITUDE_WGS84: number;
  SAMPLE_LATITUDE_WGS84: number;
  SAMPLE_EASTING: number;
  SAMPLE_NORTHING: number;
  SAMPLE_UTM_ZONE: string;
  SAMPLE_LOCATION_DESCRIPTION: string;
  LOCATION_ACCURACY: number;
  COMMENTS: string;
  LAST_UPDATE: string;
}

export interface DepositSummaryWfsType {
  type: string;
  features: DepositSummaryReportFeatureType[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  crs: {
    type: string;
    properties: any;
  };
  bbox: number[];
}

export interface DepositSummaryReportType {
  ACCURACY_M: number;
  COMMODITY_CODES: string;
  COMMODITY_NAMES: string;
  COMPANIES: null;
  COMPANY_WEBSITES: null;
  DEPOSIT_MODEL: string;
  DEPOSIT_NAME: string;
  DEPOSIT_SIGNIFICANCE: number;
  ENO: number;
  GEOLOGIC_AGE: any;
  LAT_GDA94: number;
  LINKED_FILES: string;
  LONG_GDA94: number;
  OPERATING_STATUS: string;
  PROVINCES: string;
  STATE: string;
  SYNONYMS: any;
  correctedCommodNames: string;
}

export interface DepositWfsResourceReservesType {
  type: string;
  features: DepositResourceFeatureType[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  crs: {
    type: string;
    properties: any;
  };
}

export interface DepositResourceFeatureType {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  geometry_name?: string;
  properties: DepositResourceReservesPropertiesType;
}

export interface DepositResourceReservesPropertiesType {
  ENO: number;
  DEPOSIT_NAME: string;
  LONG_GDA94: number;
  LAT_GDA94: number;
  STATE: string;
  OPERATING_STATUS: string;
  ZONE_ENO: number;
  ZONE_NAME: string;
  RESOURCE_NO: number;
  RECORD_DATE: string;
  CLASSIFICATION_METHOD: string;
  INCLUSIVE: 'Y' | 'N';
  ZEROED: 'Y' | 'N';
  TONNAGE_UNIT: 'Mt' | 'Kt';
  PROVEN_RESERVES: number;
  PROBABLE_RESERVES: number;
  PROVEN_PROBABLE_RESERVES: number;
  MEASURED_RESOURCES: number;
  INDICATED_RESOURCES: number;
  MEASURED_INDICATED_RESOURCES: number;
  INFERRED_RESOURCES: number;
  OTHER_RESOURCES: number;
  GRADE_NO: number;
  COMMODITY_CODE: string;
  COMMODITY_NAME: string;
  GRADE_UNIT: 'g/t' | '%' | 'ppm' | 'ppb';
  PROVEN_GRADE: number;
  PROBABLE_GRADE: number;
  PROVEN_PROBABLE_GRADE: number;
  MEASURED_GRADE: number;
  INDICATED_GRADE: number;
  MEASURED_INDICATED_GRADE: number;
  INFERRED_GRADE: number;
  OTHER_GRADE: number;
  RESOURCE_REF: string;
}

export interface DepositResourcesReservesTableRowType extends DepositResourcesReservesTotalType {
  recordDate: string;
  depositNumber: number;
  depositName: string;
  commodity: string;
  resourceReserveCategory: ResourceReserveCategoryType;
  classificationMethod: string;
  // Indicates whether the row is a Resource or a Reserve
  isResource: boolean;
}

export interface DepositResourcesReservesTotalType {
  tonnage: number;
  tonnageUnits: 'Mt' | 'Kt';
  grade: number;
  gradeUnits: 'g/t' | '%' | 'ppm' | 'ppb';
  containedMetal: number;
  containedMetalUnits: 'Mt' | 'Kt';
}

export enum ResourceReserveCategoryType {
  'Indicated resource' = 'Indicated resource',
  'Inferred resource' = 'Inferred resource',
  'Measured resource' = 'Measured resource',
  'Other resource' = 'Other resource',
  'Probable (ore) reserve' = 'Probable (ore) reserve',
  'Proved (ore) reserve' = 'Proved (ore) reserve',
}
