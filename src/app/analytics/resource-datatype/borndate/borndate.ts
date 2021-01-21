import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[borndate-datatype]',
  templateUrl: './borndate.html',
  styleUrls: ['./borndate.scss']
})
export class BornDateComponent implements OnInit {
  @Input() itemData:any;
  @Input() datatype:any;
  listOfDataType:any = ['bornPeriod', 'bornDate', 'bornString'];
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
