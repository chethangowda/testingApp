import { Component, Input } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';


@Component({
  selector: '[practitionerRes]',
  styleUrls: ['practitioner.component.scss'],
  templateUrl: 'practitioner.component.html'
  // template: `
  //   <button [satPopoverAnchor]="p" (mouseenter)="p.open()"
  //   (mouseleave)="p.close()">More Info</button>

  //   <sat-popover #p horizontalAlign="after" verticalAlign="above">
  //     <div class="info-wrapper">
  //       Username: {{ user.username }} <br>
  //       Posts: {{ user.posts }}
  //     </div>
  //   </sat-popover>
  // `
})
export class PractitonerResComponent {
  @Input() popoverData:any;
  @Input() resourceName:any;

  practitionerData:any;
  isLoading:boolean = false;
  organizeData:any;
  isNoRecords:any;
  selectedValue:any;
  constructor(private patientViewService: PatientViewService) {

  }

  ngOnInit() {
    this.practitionerData;
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
          this.getPractitionerDetails(reference);
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
      this.getPractitionerDetails(event.reference);
    }
  }

  isArray(val): boolean { return val instanceof Array };

  getPractitionerDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.practitionerData = data;
      } else {
        this.isNoRecords = true;
      }
    }, error => {
      this.isLoading = false;
      this.isNoRecords = true;
    })
}

}
