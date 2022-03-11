import { NgModule } from '@angular/core';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import { CustomBarVerticalComponent } from './custom.bar.vertical.component';

@NgModule({
  declarations: [
    CustomBarVerticalComponent
  ],
  imports: [
    NgxChartsModule
  ],
  exports: [
    CustomBarVerticalComponent
  ],
  providers: []
})
export class CustomBarVerticalModule {
}
