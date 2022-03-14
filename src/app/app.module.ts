import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CustomBarVerticalModule} from "./custom-vertical-bar-chart/custom.bar.vertical.module";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {CustomGroupedVerticalBarModule} from "./custom-grouped-vertical-bar-chart/custom.grouped.vertical.bar.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CustomBarVerticalModule,
    CustomGroupedVerticalBarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
