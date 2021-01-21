import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[onset-datatype]',
  templateUrl: './onset.html',
  styleUrls: ['./onset.scss']
})
export class OnsetComponent implements OnInit {
  @Input() itemData:any;
  @Input() datatype:any;
  listOfDataType:any = ['onsetDateTime', 'onsetAge', 'onsetPeriod', 'onsetRange', 'onsetString'];
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
