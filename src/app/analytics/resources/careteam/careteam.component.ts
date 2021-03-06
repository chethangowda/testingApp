import { Component, Input, OnInit } from '@angular/core';
import { PatientViewService } from 'src/services/patientview_sevice';

@Component({
  selector: '[careteamRes]',
  templateUrl: './careteam.component.html',
  styleUrls: ['./careteam.component.scss']
})
export class CareteamComponent implements OnInit {
  @Input() popoverData:any;
  @Input() isNoReference:any;
  careteamData:any;
  isLoading:boolean = false;
  isNoRecords:any;
  selectedValue:any;
  selectedResData:any;

  constructor(private patientViewService: PatientViewService,) { }

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
          this.getcareteamDetails(reference);
        }
      }
    }
  }

  onSelectChange(event) {
    if('reference' in event && event.reference) {
      this.getcareteamDetails(event.reference);
    }
  }

  isArray(val): boolean { return val instanceof Array };

  getcareteamDetails(value) {
    this.isLoading = true;
    this.patientViewService.getLocationResource(value).subscribe(data => {
      this.isLoading = false;
      if(data) {
        this.careteamData = data;
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
