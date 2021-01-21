import { Component, Input, OnInit } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';

@Component({
  selector: '[relatedpersonres]',
  templateUrl: './relatedperson.component.html',
  styleUrls: ['./relatedperson.component.scss']
})
export class RelatedpersonComponent implements OnInit {
  @Input() popoverData:any;
  @Input() resourceName:any;
  isLoading:boolean = false;
  relatedData:any;
  isNoRecords:any;
  constructor(private patientViewService: PatientViewService) { }

  ngOnInit() {
    this.relatedData = null;
  }

  ngOnChanges() {
    this.isNoRecords;
    if(this.popoverData) {
      let reference;
      if(this.popoverData instanceof Array) {
        reference = this.popoverData[0].reference;
      } else if(this.popoverData instanceof Object) {
        reference = this.popoverData.reference;
      }

      if(reference) {
        this.getrelatedDetails(reference);
      }
    }
  }

  getrelatedDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.relatedData = data;
      } else {
        this.isNoRecords = true;
      }

    }, error => {
      this.isLoading = false;
      this.isNoRecords = true;
    })
}

selectedResData:any;
locdata: any = null;
onclickResourceLink(item) {
  this.selectedResData = null;
  this.locdata = null;
  this.locdata = item
  if(item instanceof Array) {
    this.selectedResData = [];
    for (let l_item of item ){
      if('location' in l_item) {
      this.selectedResData.push(l_item.location);
      }
      else if('individual' in l_item) {
        this.selectedResData.push(l_item.individual);
        }
    }

  }else if(item instanceof Object) {
    this.selectedResData = item;
  }

}

}
