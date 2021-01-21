import {Component, OnInit, NgZone} from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  isSelectedTab:any = "patientview";

  constructor(private patientViewService: PatientViewService,
    private ngZone: NgZone) {


    // this.patientViewService.searchPatientData().subscribe(data => {
    // })
  }

  ngOnChanges() {
    // this.isSelectedTab
  }

  ngOnInit() {
  }

  onGetSelectedTab(event) {
    this.ngZone.run(() => {
      this.isSelectedTab = event;
    })

  }

}
