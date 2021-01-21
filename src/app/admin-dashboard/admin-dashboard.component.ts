import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  isSelectedTab: any = "extraction";

  constructor(private activeRout: ActivatedRoute) {
  }

  ngOnInit() {

  }

  onGetSelectedTab(event) {
    this.isSelectedTab = event;
  }
}
