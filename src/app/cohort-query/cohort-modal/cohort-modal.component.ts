import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeactivateDialogComponent } from 'src/app/group-management/deactivate-dialog/deactivate-dialog.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cohort-modal',
  templateUrl: './cohort-modal.component.html',
  styleUrls: ['./cohort-modal.component.scss']
})
export class CohortModalComponent implements OnInit {

  queryForm: FormGroup;
  dialogData: any;
  constructor(public dialogRef: MatDialogRef<DeactivateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.dialogData = data.x;
    this.queryForm = this.fb.group({
      queryName: ['', Validators.required]
    })

    if (this.dialogData == 'execute') {
      this.queryForm.get('queryName').clearValidators();
      this.queryForm.get('queryName').updateValueAndValidity();
    }

  }

  ngOnInit() {
  }

  onSubmit(queryForm) {
    if (queryForm.valid) {
      this.dialogRef.close({ queryName: queryForm.value.queryName });
    } else {
      this.validateAllFields(this.queryForm);
      return false
    }
  }

  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

}
