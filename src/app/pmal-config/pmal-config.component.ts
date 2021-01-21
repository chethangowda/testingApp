import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pmal-config',
  templateUrl: './pmal-config.component.html',
  styleUrls: ['./pmal-config.component.scss']
})
export class PmalConfigComponent implements OnInit {
  isSelectedTab: any = 'rulesconfig';
  constructor() { }

  ngOnInit() {
  }

  onGetSelectedTab(event) {
    this.isSelectedTab = event;
  }


}
