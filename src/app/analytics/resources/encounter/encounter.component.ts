import { Component, OnInit, Input } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';

@Component({
  selector: '[encounterRes]',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.scss']
})
export class EncounterResComponent implements OnInit {
  @Input() popoverData:any;
  @Input() resourceName:any;
  isLoading:boolean = false;
  encounterData:any;
  isNoRecords:any;
  constructor(private patientViewService: PatientViewService) { }

  ngOnInit() {
    this.encounterData = null;
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
        this.getencounterDetails(reference);
      }
    }
  }

  getencounterDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.encounterData = data;
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
