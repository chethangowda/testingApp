import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[performed-datatype]',
  templateUrl: './performed.html',
  styleUrls: ['./performed.scss']
})
export class PerformedComponent implements OnInit {
  @Input() itemData:any;
  @Input() datatype:any;
  listOfDataType:any = ['performedDateTime', 'performedPeriod', 'performedString', 'performedAge', 'performedRange'];
  presentDataType:any;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if(this.itemData) {
      for(let item of this.listOfDataType) {
        if(item in this.itemData) {
          this.presentDataType = item;
          break;
        }
      }
    }
  }

}
