import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit {
  title: any;
  service: any;
  configdata: any;
  constructor(public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.configdata = data;
    this.service = data.x.category;

    if (this.configdata.x.active == true) {
      this.title = 'In-Activate';
    }
    else if (this.configdata.x.active == false) {
      this.title = 'Activate';
    }
  }

  ngOnInit() {
  }

  deactivate() {
    this.dialogRef.close(this.configdata);
  }

}
