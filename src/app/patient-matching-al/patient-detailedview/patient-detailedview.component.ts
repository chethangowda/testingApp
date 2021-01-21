import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-patient-detailedview',
  templateUrl: './patient-detailedview.component.html',
  styleUrls: ['./patient-detailedview.component.scss']
})
export class PatientDetailedviewComponent implements OnInit {
  displayedColumns: string[] = ['inpxid', 'fname', 'mname', 'lname', 'dob', 'gender', 'ssn', 'phone'];
  isSelectedTab: any = 'tableview';
  dataSource = new MatTableDataSource();
  tabulardata = [];
  jsonview = [];
  constructor(public dialogRef: MatDialogRef<PatientDetailedviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.tabulardata.push(data.ev);
    this.jsonview.push(data.data);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tabulardata);
  }

  onSelectLink(event) {
    this.isSelectedTab = event;
  }
}
