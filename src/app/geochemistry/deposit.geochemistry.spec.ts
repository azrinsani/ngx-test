import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import any = jasmine.any;
import { DepositSummaryReportGetFeaturesResultType } from "./deposit.summary.report.type";
import { mockDepositGeochemistryJson } from "./deposit.geochemistry.mock";

describe('DepositGeochemistryComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        BrowserAnimationsModule
      ],
      providers: [
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    });
  }));

  beforeEach(() => {
  });

  it('can instantiate', () => {
    // expect(component).not.toBeNull();
  });

  it('should transform data into Polar Chart format', () => {
    const getFeatureResult: DepositSummaryReportGetFeaturesResultType = JSON.parse(mockDepositGeochemistryJson);

  });

});
