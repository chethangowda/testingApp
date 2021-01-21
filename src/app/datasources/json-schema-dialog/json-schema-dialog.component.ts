import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatasourceService } from 'src/services/datasourcec.service';

@Component({
  selector: 'app-json-schema-dialog',
  templateUrl: './json-schema-dialog.component.html',
  styleUrls: ['./json-schema-dialog.component.scss']
})
export class JsonSchemaDialogComponent implements OnInit {
  id: any;
  jsonData: any;
  constructor(public dialogRef: MatDialogRef<JsonSchemaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private datasourceService: DatasourceService) {
    this.jsonData = data;
  }

  ngOnInit() {
  }

}
