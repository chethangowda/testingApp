import { Component, Input, OnInit } from '@angular/core';

@Component({
selector: '[value-datatype]',
templateUrl: './value.html',
styleUrls: ['./value.scss']
})
export class ValueComponent implements OnInit {
@Input() itemData:any;
@Input() datatype:any;
listOfDataType:any = ['valueQuantity', 'valueCodeableConcept', 'valueString', 'valueBoolean', 'valueInteger', 'valueRange', 'valueRatio', 'valueSampledData', 'valueTime', 'valueDateTime', 'valuePeriod'];
presentDataType:any;
constructor() { }

ngOnInit() {
}

ngOnChanges() {
this.presentDataType;
if(this.itemData) {

if('component' in this.itemData) {
for(let itemComponent of this.itemData.component) {
for(let itemVal of this.listOfDataType) {
if(itemVal in itemComponent) {
itemComponent.valueType = itemVal;
}
}
}
}


for(let item of this.listOfDataType) {
if(item in this.itemData) {
this.presentDataType = item;
break;
}
}
}

}

}