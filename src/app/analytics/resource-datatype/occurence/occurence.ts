import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[occurence-datatype]',
  templateUrl: './occurence.html',
  styleUrls: ['./occurence.scss']
})
export class OccurenceComponent implements OnInit {
  @Input() itemData:any;
  @Input() datatype:any;
  listOfDataType:any = ['occurrenceDateTime', 'occurrencePeriod', 'occurrenceTiming'];
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
