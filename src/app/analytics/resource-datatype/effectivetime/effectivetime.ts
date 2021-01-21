import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[effectivetime-datatype]',
  templateUrl: './effectivetime.html',
  styleUrls: ['./effectivetime.scss']
})
export class EffectiveTimeComponent implements OnInit {
  @Input() itemData:any;
  @Input() datatype:any;
  listOfDataType:any = ['effectiveDateTime', 'effectivePeriod'];
  responseData:any;
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
