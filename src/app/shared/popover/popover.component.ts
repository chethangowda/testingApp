import { Component, Input } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';

@Component({
  selector: 'app-popover',
  styleUrls: ['popover.component.scss'],
  templateUrl: 'popover.component.html'
})
export class PopOverComponent {
  @Input() popoverData: any;
  @Input() resourceName: any;

  tableColumns: any = [
    {
      name: 'Organization',
      columns: [
        { cName: 'Name' },
        { cName: 'Identifiers' },
        { cName: 'Telecom' }
      ]
    },
    {
      name: 'Location',
      columns: [
        { cName: 'Name' },
        { cName: 'Identifiers' },
        { cName: 'Telecom' },
        { cName: 'Type' },
        { cName: 'Address' },
        { cName: 'Organization' }
      ]
    },
    {
      name: 'Practitoner',
      columns: [
        { cName: 'Name' },
        { cName: 'Identifiers' },
        { cName: 'Telecom' }
      ]
    },
    {
      name: 'Practitoner Role',
      columns: [
        { cName: 'Speciality' },
        { cName: 'Organization' },
        { cName: 'Practitoner' }
      ]
    }
  ]
  organizationData: any;
  isLoading: boolean = false;
  organizeData: any;
  constructor(private patientViewService: PatientViewService) {

  }

  ngOnInit() {
    this.organizationData = null;
  }

  ngOnChanges() {
    if (this.popoverData) {
      this.getOrganizationDetails(this.popoverData.Organization);
    }
  }

  getOrganizationDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if (data) {
        this.organizationData = data;
      }

    }, error => {
      this.isLoading = false;
    })
  }

}
