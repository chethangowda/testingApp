import { Component, Input, ViewChild } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';
import { MdePopoverTrigger } from '@material-extended/mde';


@Component({
  selector: '[practitionerRoleRes]',
  styleUrls: ['practitioner-role.component.scss'],
  templateUrl: 'practitioner-role.component.html'
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
export class PractitonerRoleResComponent {
  @ViewChild('target2', { static: false }) target2: MdePopoverTrigger;
  @Input() popoverData:any;
  @Input() resourceName:any;

  practitionerRoleData:any;
  isLoading:boolean = false;
  organizeData:any;
  isNoRecords:any;
  selectedValue:any;
  constructor(private patientViewService: PatientViewService) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    // this.isNoRecords;
    // if(this.popoverData) {
    //   this.selectedValue = this.popoverData[0];
    //   this.onSelectChange(this.selectedValue);
    //   // let reference = this.popoverData.reference;
    //   // if(reference) {
    //   //   this.getPractitionerRoleDetails(reference);
    //   // }
    // }
    this.isNoRecords;
    if(this.popoverData) {
      if(this.popoverData instanceof Array) {
        this.selectedValue = this.popoverData[0];
        this.onSelectChange(this.selectedValue);
      } else if(this.popoverData instanceof Object) {
        let reference = this.popoverData.reference;
        if(reference) {
          this.getPractitionerRoleDetails(reference);
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
      this.getPractitionerRoleDetails(event.reference);
    }
  }
  isArray(val): boolean { return val instanceof Array };

  getPractitionerRoleDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.practitionerRoleData = data;
      } else {
        this.isNoRecords = true;
      }

    }, error => {
      this.isLoading = false;
      this.isNoRecords = true;
    })
}

selectedResData:any;
onclickResourceLink(item) {
  this.selectedResData = null;
  this.selectedResData = item;
}

}
