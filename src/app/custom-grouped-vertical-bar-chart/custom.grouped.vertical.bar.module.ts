import { NgModule } from '@angular/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { CustomGroupedVerticalBarComponent } from './custom.grouped.vertical.bar.component';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";

@NgModule({
  declarations: [
    CustomGroupedVerticalBarComponent
  ],
  imports: [
    NgxChartsModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    CustomGroupedVerticalBarComponent
  ],
  providers: []
})
export class CustomGroupedVerticalBarModule {
}
