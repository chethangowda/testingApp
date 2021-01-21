import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[abatement-datatype]',
  templateUrl: './abatement.html',
  styleUrls: ['./abatement.scss']
})
export class AbatementComponent implements OnInit {
  @Input() itemData:any;
  @Input() datatype:any;
  listOfDataType:any = ['abatementDateTime', 'abatementAge', 'abatementPeriod', 'abatementRange', 'abatementString'];
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
