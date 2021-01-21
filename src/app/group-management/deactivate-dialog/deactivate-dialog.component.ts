import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-deactivate-dialog',
  templateUrl: './deactivate-dialog.component.html',
  styleUrls: ['./deactivate-dialog.component.scss']
})
export class DeactivateDialogComponent implements OnInit {
  title: any;
  grpName: any;
  groupdata: any;

  constructor(public dialogRef: MatDialogRef<DeactivateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.groupdata = data;
    this.grpName = data.x.Name;

    if (this.groupdata.x.Status === 'Active') {
      this.title = 'In-Activate';
    }
    else if (this.groupdata.x.Status === 'Inactive') {
      this.title = 'Activate';
    }
  }

  ngOnInit() {
  }

  deactivate() {
    this.dialogRef.close(this.groupdata);
  }
}
