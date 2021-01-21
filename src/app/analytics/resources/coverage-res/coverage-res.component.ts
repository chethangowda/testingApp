import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';

@Component({
  selector: '[CoverageRes]',
  templateUrl: './coverage-res.component.html',
  styleUrls: ['./coverage-res.component.scss']
})
export class CoverageResComponent implements OnInit {
  @Input() popoverData:any;
  @Input() resourceName:any;
  @Input() isNoReference:any;

  coverageData:any;
  isLoading:boolean = false;
  organizeData:any;
  isNoRecords:any;
  selectedValue: any;
  constructor(private patientViewService: PatientViewService) { }

  ngOnInit() {
    this.coverageData = null;
  }

  isArray(val): boolean { return val instanceof Array };

  ngOnChanges() {
    this.isNoRecords;
    if(this.popoverData) {
      if(this.popoverData instanceof Array) {
        this.selectedValue = this.popoverData[0];
        this.onSelectChange(this.selectedValue);
      } else if(this.popoverData instanceof Object) {
        let reference = this.popoverData.reference;
        if(reference) {
          this.getcoverageDetails(reference);
        }
      }
    }
  }

  onSelectChange(event) {
    if('reference' in event && event.reference) {
      this.getcoverageDetails(event.reference);
    }
  }

  getcoverageDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.coverageData = data;
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
