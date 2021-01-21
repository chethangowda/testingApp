import { Component, Input, OnInit } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';

@Component({
  selector: '[claimrespRes]',
  templateUrl: './claimresp.component.html',
  styleUrls: ['./claimresp.component.scss']
})
export class ClaimrespComponent implements OnInit {
  @Input() popoverData:any;
  @Input() isNoReference:any;
  claimresData:any;
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
          this.getclaimresDetails(reference);
        }
      }
    }
  }

  onSelectChange(event) {
    if('reference' in event && event.reference) {
      this.getclaimresDetails(event.reference);
    }
  }

  isArray(val): boolean { return val instanceof Array };

  getclaimresDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.claimresData = data;
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
