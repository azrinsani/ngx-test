import { TestBed } from '@angular/core/testing';
import {CustomGroupedVerticalBarComponent} from "./custom.grouped.vertical.bar.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CustomGroupedVerticalBarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      declarations: [CustomGroupedVerticalBarComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CustomGroupedVerticalBarComponent);
    const customGroupedVerticalBarComponent = fixture.debugElement.componentInstance;
    expect(customGroupedVerticalBarComponent).toBeTruthy();
  });

  it(`should have as title 'ngx-charts'`, () => {
    const fixture = TestBed.createComponent(CustomGroupedVerticalBarComponent);
    const customGroupedVerticalBarComponent: CustomGroupedVerticalBarComponent = fixture.debugElement.componentInstance;
    //expect(customGroupedVerticalBarComponent.dims).toEqual('ngx-charts');
    console.log(fixture.debugElement.nativeElement);
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(CustomGroupedVerticalBarComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('ngx-charts app is running!');
  // });
});
