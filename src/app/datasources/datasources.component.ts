import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DatasourcesService } from './datasources.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-datasources',
  templateUrl: './datasources.component.html',
  styleUrls: ['./datasources.component.scss']
})
export class DatasourcesComponent implements OnInit {
  isSelectedTab: any = "datasourceview";

  constructor() { }

  ngOnInit() {
  }

  onGetSelectedTab(event) {
    this.isSelectedTab = event;
  }
}
