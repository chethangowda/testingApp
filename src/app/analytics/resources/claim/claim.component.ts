import { Component, Input, OnInit } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';

@Component({
  selector: '[claimRes]',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
  @Input() popoverData:any;
  @Input() isNoReference:any;
  claimData:any;
  isLoading:boolean = false;
  isNoRecords:any;
  selectedValue:any;
  selectedResData:any;


  constructor(private patientViewService: PatientViewService) { }

  ngOnInit() {
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
          this.getclaimDetails(reference);
        }
      }
    }
  }

  onSelectChange(event) {
    if('reference' in event && event.reference) {
      this.getclaimDetails(event.reference);
    }
  }

  isArray(val): boolean { return val instanceof Array };

  getclaimDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.claimData = data;
      } else {
        this.isNoRecords = true;
      }

    }, error => {
      this.isLoading = false;
      this.isNoRecords = true;
    })
  }

  onclickResourceLink(item) {
    this.selectedResData = null;
    this.selectedResData = item;
  }

}
