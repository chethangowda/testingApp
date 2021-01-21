import { Component, Input, NgZone } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';


@Component({
  selector: '[locationRes]',
  styleUrls: ['location.component.scss'],
  templateUrl: 'location.component.html'
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
export class LocationResComponent {
  @Input() popoverData:any;
  @Input() isNoReference:any;

  locationData:any;

  isLoading:boolean = false;
  organizeData:any;
  isNoRecords:any;
  selectedValue:any;
  constructor(private patientViewService: PatientViewService,
    private ngZone: NgZone) {

  }

  ngOnInit() {
    // this.locationData = null;
  }

  // ngOnChanges() {
  //   this.isNoRecords;
  //   if(this.locationRef) {
  //     let reference = this.locationRef.reference;
  //     if(reference) {
  //       this.getLocationDetails(reference);
  //     }

  //   }
  // }

  ngOnChanges() {
    this.isNoRecords;
    if(this.popoverData) {
      if(this.popoverData instanceof Array) {
        this.selectedValue = this.popoverData[0];
        this.onSelectChange(this.selectedValue);
      } else if(this.popoverData instanceof Object) {
        let reference = this.popoverData.reference;
        if(reference) {
          this.getLocationDetails(reference);
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
      this.getLocationDetails(event.reference);
    }
  }

  isArray(val): boolean { return val instanceof Array };


  getLocationDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.locationData = data;
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
