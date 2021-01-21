import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {AnalyticsRoutingModule} from './analytics-routing.module';
import {AnalyticsComponent} from './analytics.component';
import {AnalyticsHeaderComponent} from './analytics-header/analytics-header.component';
import {AnalyticsContentComponent} from './analytics-content/analytics-content.component';
import {PatientDetailsComponent} from './patient-details/patient-details.component';
import { CohortQueryComponent } from '../cohort-query/cohort-query.component';
import { CohortQueryBuilderComponent } from '../cohort-query/cohort-query-builder/cohort-query-builder.component';
import { PopOverComponent } from '../shared/popover/popover.component';
import { MdePopoverModule } from '@material-extended/mde';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrganizationResComponent } from './resources/organization/organization.component';
import { LocationResComponent } from './resources/location/location.component';
import { PractitonerResComponent } from './resources/practitioner/practitioner.component';
import { PractitonerRoleResComponent } from './resources/practitioner-role/practitioner-role.component';
import { EncounterResComponent } from './resources/encounter/encounter.component';
import { CoverageResComponent } from './resources/coverage-res/coverage-res.component';
import { RelatedpersonComponent } from './resources/relatedperson/relatedperson.component';
import { CareteamComponent } from './resources/careteam/careteam.component';
import { DiagnosticreportComponent } from './resources/diagnosticreport/diagnosticreport.component';
import { ServicerequestComponent } from './resources/servicerequest/servicerequest.component';
import { ClaimComponent } from './resources/claim/claim.component';
import { ClaimrespComponent } from './resources/claimresp/claimresp.component';
import { EffectiveTimeComponent } from './resource-datatype/effectivetime/effectivetime';
import { OccurenceComponent } from './resource-datatype/occurence/occurence';
import { OnsetComponent } from './resource-datatype/onset/onset';
import { PerformedComponent } from './resource-datatype/performed/performed';
import { ValueComponent } from './resource-datatype/value/value';
import { AbatementComponent } from './resource-datatype/abatement/abatement';
import { BornDateComponent } from './resource-datatype/borndate/borndate';

@NgModule({
  declarations: [
    AnalyticsComponent,
    AnalyticsHeaderComponent,
    AnalyticsContentComponent,
    PatientDetailsComponent,
    CohortQueryComponent,
    CohortQueryBuilderComponent,
    PopOverComponent,
    OrganizationResComponent,
    LocationResComponent,
    PractitonerResComponent,
    PractitonerRoleResComponent,
    EncounterResComponent,
    CoverageResComponent,
    RelatedpersonComponent,
    CareteamComponent,
    DiagnosticreportComponent,
    ServicerequestComponent,
    ClaimComponent,
    ClaimrespComponent,
    EffectiveTimeComponent,
    OccurenceComponent,
    OnsetComponent,
    PerformedComponent,
    ValueComponent,
    AbatementComponent,
    BornDateComponent
  ],
  exports: [
    AnalyticsHeaderComponent,
    AnalyticsContentComponent,
    CohortQueryComponent,
  ],
  imports: [
    SharedModule,
    AnalyticsRoutingModule,
    MdePopoverModule
  ],
})
export class AnalyticsModule {
}
