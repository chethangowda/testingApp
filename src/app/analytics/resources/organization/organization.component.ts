import { Component, Input } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';


@Component({
  selector: '[organizationRes]',
  styleUrls: ['organization.component.scss'],
  templateUrl: 'organization.component.html'
})
export class OrganizationResComponent {
  @Input() popoverData:any;
  @Input() resourceName:any;

  organizationData:any;
  isLoading:boolean = false;
  organizeData:any;
  isNoRecords:any;
  selectedValue: any;
  constructor(private patientViewService: PatientViewService) {

  }

  ngOnInit() {
    this.organizationData = null;
  }

  ngOnChanges() {
    this.isNoRecords;
    if(this.popoverData) {
      if(this.popoverData instanceof Array) {
        this.selectedValue = this.popoverData[0];
        this.onSelectChange(this.selectedValue);
      } else if(this.popoverData instanceof Object) {
        let reference = this.popoverData.reference;
        if(reference) {
          this.getOrganizationDetails(reference);
        }
      }
      // let reference = this.selectedValue.reference;
      // if(reference) {
        // this.getPractitionerDetails(reference);
      // }
    }
  }

  onSelectChange(event) {
    if('reference' in event && event.reference) {
      this.getOrganizationDetails(event.reference);
    }
  }
  isArray(val): boolean { return val instanceof Array };

  getOrganizationDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.organizationData = data;
      } else {
        this.isNoRecords = true;
      }

    }, error => {
      this.isLoading = false;
      this.isNoRecords = true;
    })
}

}
