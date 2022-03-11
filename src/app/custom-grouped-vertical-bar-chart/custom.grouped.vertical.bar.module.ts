import { NgModule } from '@angular/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { CustomGroupedVerticalBarComponent } from './custom.grouped.vertical.bar.component';

@NgModule({
  declarations: [
    CustomGroupedVerticalBarComponent
  ],
  imports: [
    NgxChartsModule
  ],
  exports: [
    CustomGroupedVerticalBarComponent
  ],
  providers: []
})
export class CustomGroupedVerticalBarModule {
}
