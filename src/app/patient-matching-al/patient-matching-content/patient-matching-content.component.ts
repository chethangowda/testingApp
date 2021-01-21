import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientMatchingService } from 'src/services/patient-matching.service';
import { MatTableDataSource, MatSort, Sort, MatDialog } from '@angular/material';
import { LoaderService } from 'src/core/loader/loader.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PatientDetailedviewComponent } from '../patient-detailedview/patient-detailedview.component';

@Component({
  selector: 'app-patient-matching-content',
  templateUrl: './patient-matching-content.component.html',
  styleUrls: ['./patient-matching-content.component.scss']
})

export class PatientMatchingContentComponent implements OnInit {
  displayedColumns: string[] = ['group', 'inpxid', 'fname', 'mname', 'lname', 'ssn', 'dob', 'gender', 'phone', 'city', 'state', 'pcode'];
  displayedconflictColumns: string[] = ['select', 'action', 'fname', 'mname', 'lname', 'ssn',
    'dob', 'gender', 'phone', 'city', 'state', 'pcode', 'score', 'mlpredict'];
  displayedmlcolumns: string[] = ['id', 'date', 'resolveconflicts', 'accuracy', 'patients', 'overallaccuracy'];
  dataSource = new MatTableDataSource();
  conflictdataSource = new MatTableDataSource();
  mldataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  conflictarray: any = []; groupper: any = [];
  statsarray: any[];
  next: boolean = false;
  previous: boolean = false;
  patientgroups: boolean = true;
  stats: boolean;
  currentPage: number;
  pageSize: number;
  status: string;
  gender: string;
  loadgrpres: any;
  parsejson: any;
  fname: any;
  mname: any;
  lname: any;
  recordssn: any;
  phone: any;
  city: any;
  postalcode: any;
  state: any;
  conflicts: any;
  conflictrecord: any;
  mlres: any;
  linkres: any;
  excluderes: any;
  isSelectedTab: any = 'tabview';
  currentpage: number = 1;
  pageres: any;

  @ViewChild(MatSort, { static: true }) matsort: MatSort;
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };

  constructor(private patientmatchingservice: PatientMatchingService, private notification: LoaderService, private dialog: MatDialog) { }

  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
      }
    }
    this.loadGroupsData();
  }

  loadGroupsData() {
    this.currentPage = 1;
    this.pageSize = 1;
    this.patientmatchingservice.getListofconflictsGroupsByPage(this.currentPage, this.pageSize).subscribe((response: any) => {
      if (response.groups.length != 0) {
        this.pageres = response;
        this.loadgrpres = this.pageres.groups[0];
        this.loadpatient(this.loadgrpres);
      }
      else {
        this.notification.showNotificationMsg('No Patient Groups are present', 'warn', 'warn');
        this.previous = true;
        this.next = true;
      }
    }, error => {
      this.previous = true;
      this.next = true;
    });
  }

  nextGroup() {
    const currentPage = this.currentPage++;
    this.patientmatchingservice.getListofconflictsGroupsByPage(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.pageres = response;
      this.loadgrpres = this.pageres.groups[0];
      this.loadpatient(this.loadgrpres);
    });
  }

  prevGroup() {
    this.currentPage--;
    this.patientmatchingservice.getListofconflictsGroupsByPage(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.pageres = response;
      this.loadgrpres = this.pageres.groups[0];
      this.loadpatient(this.loadgrpres);
    });
  }

  page() {
    const currentpage = this.pageres.currentPage;
    const totalrecords = this.pageres.totalRecords;
    if (currentpage === 1 && (totalrecords > currentpage)) {
      this.previous = true;
      this.next = false;
    }
    else if (currentpage === 1 && totalrecords === 1) {
      this.previous = true;
      this.next = true;
    }
    else if (totalrecords === currentpage) {
      this.previous = false;
      this.next = true;
    }
    else {
      this.previous = false;
      this.next = false;
    }
  }

  loadpatient(patientdata) {
    this.selection = new SelectionModel(true, []);
    this.loadgrpres = [];
    this.parsejson = [];
    this.conflicts = [];
    this.conflictarray = [];
    this.loadgrpres = patientdata;
    this.parsejson = JSON.parse(this.loadgrpres.interopxRecord);
    this.fname = '-';
    this.mname = '-';
    this.lname = '-';
    this.recordssn = '-';
    this.phone = '-';
    this.gender = '-';
    this.city = '-';
    this.state = '-';
    this.postalcode = '-';
    if (this.parsejson.name[0]) {
      if (this.parsejson.name[0].given) {
        this.fname = this.parsejson.name[0].given[0];
      } else {
        this.fname = '-';
      }
      if (this.parsejson.name[0].given[1]) {
        this.mname = this.parsejson.name[0].given[1];
      } else {
        this.mname = '-';
      }
      if (this.parsejson.name[0].family) {
        this.lname = this.parsejson.name[0].family;
      } else {
        this.lname = '-';
      }
    }

    for (let j = 0; j < this.parsejson.identifier.length; j++) {
      if (this.parsejson.identifier[j].type) {
        if (this.parsejson.identifier[j].type.coding.length > 0) {
          if (this.parsejson.identifier[j].type.coding[0].code === 'SS') {
            if (this.parsejson.identifier[j].value) {
              this.recordssn = this.parsejson.identifier[j].value;
            } else {
              this.recordssn = '-';
            }
          }
        }
      } else {
        this.recordssn = '-';
      }
    }

    if (this.parsejson.gender) {
      if (this.parsejson.gender === 'u') {
        this.gender = 'unknown'
      }
      else {
        this.gender = this.parsejson.gender
      }
    }

    if (this.parsejson.telecom) {
      if (this.parsejson.telecom.length > 0) {
        for (let n = 0; n < this.parsejson.telecom.length; n++) {
          if ((this.parsejson.telecom[n].system === 'Phone') || this.parsejson.telecom[n].system === 'phone') {
            if (this.parsejson.telecom[n].value) {
              this.phone = this.parsejson.telecom[n].value;
              break;
            } else {
              this.phone = '-';
            }
          }
        }
      }
    }

    if (this.parsejson.address) {
      if (this.parsejson.address.length > 0) {
        for (let l = 0; l < this.parsejson.address.length; l++) {
          if (this.parsejson.address[l]) {
            if (this.parsejson.address[l].city) {
              this.city = this.parsejson.address[l].city;
            } else {
              this.city = '-';
            }
            if (this.parsejson.address[l].state) {
              this.state = this.parsejson.address[l].state;
            } else {
              this.state = '-';
            }
            if (this.parsejson.address[l].postalCode) {
              this.postalcode = this.parsejson.address[l].postalCode;
            } else {
              this.postalcode = '-';
            }
          }
        }
      }
    }

    const grpjson = [{
      group: this.pageres.currentPage + ' out of ' + this.pageres.totalRecords,
      inpxid: this.loadgrpres.interopxId,
      fname: this.fname,
      mname: this.mname,
      lname: this.lname,
      ssn: this.recordssn,
      dob: this.parsejson.birthDate,
      gender: this.gender,
      phone: this.phone,
      city: this.city,
      state: this.state,
      pcode: this.postalcode
    }]
    this.dataSource = new MatTableDataSource(grpjson);

    this.conflicts = this.loadgrpres.conflicts;
    for (let i = 0; i < this.conflicts.length; i++) {
      this.fname = '-';
      this.mname = '-';
      this.lname = '-';
      this.recordssn = '-';
      this.phone = '-';
      this.gender = '-';
      this.city = '-';
      this.state = '-';
      this.postalcode = '-';
      if (this.conflicts[i].isExcluded === null) {
        this.status = '-';
      }
      else if (this.conflicts[i].isExcluded === false) {
        this.status = 'linked';
      }
      else if (this.conflicts[i].isExcluded === true) {
        this.status = 'Excluded';
      }

      this.conflictrecord = JSON.parse(this.conflicts[i].conflictedRecord);

      if (this.conflictrecord.name[0]) {
        if (this.conflictrecord.name[0].given) {
          this.fname = this.conflictrecord.name[0].given[0];
        } else {
          this.fname = '-';
        }
        if (this.conflictrecord.name[0].given[1]) {
          this.mname = this.conflictrecord.name[0].given[1];
        } else {
          this.mname = '-';
        }
        if (this.conflictrecord.name[0].family) {
          this.lname = this.conflictrecord.name[0].family;
        } else {
          this.lname = '-';
        }
      }

      for (let j = 0; j < this.conflictrecord.identifier.length; j++) {
        if (this.conflictrecord.identifier[j].type) {
          if (this.conflictrecord.identifier[j].type.coding) {
            if (this.conflictrecord.identifier[j].type.coding.length > 0) {
              if (this.conflictrecord.identifier[j].type.coding[0].code === 'SS') {
                if (this.conflictrecord.identifier[j].value) {
                  this.recordssn = this.conflictrecord.identifier[j].value;
                } else {
                  this.recordssn = '-';
                }
              }
            }
          }
        }
        else {
          this.recordssn = '-';
        }
      }
      if (this.conflictrecord.gender) {
        if (this.conflictrecord.gender === 'u') {
          this.gender = 'unknown'
        }
        else {
          this.gender = this.conflictrecord.gender
        }
      }

      if (this.conflictrecord.telecom) {
        if (this.conflictrecord.telecom.length > 0) {
          for (let n = 0; n < this.conflictrecord.telecom.length; n++) {
            if ((this.conflictrecord.telecom[n].system === 'Phone') || (this.conflictrecord.telecom[n].system === 'phone')) {
              if (this.conflictrecord.telecom[n].value) {
                this.phone = this.conflictrecord.telecom[n].value;
                break;
              } else {
                this.phone = '-';
              }
            }
          }
        }
      }

      if (this.conflictrecord.address) {
        if (this.conflictrecord.address.length > 0) {
          for (let l = 0; l < this.conflictrecord.address.length; l++) {
            if (this.conflictrecord.address[l]) {
              if (this.conflictrecord.address[l].city) {
                this.city = this.conflictrecord.address[l].city;
              } else {
                this.city = '-';
              }
              if (this.conflictrecord.address[l].state) {
                this.state = this.conflictrecord.address[l].state;
              } else {
                this.state = '-';
              }
              if (this.conflictrecord.address[l].postalCode) {
                this.postalcode = this.conflictrecord.address[l].postalCode;
              } else {
                this.postalcode = '-';
              }
            }
          }
        }
      }

      const conflictjson = {
        action: this.status,
        sourceid: this.conflicts[i].recordId,
        fname: this.fname,
        mname: this.mname,
        lname: this.lname,
        ssn: this.recordssn,
        dob: this.conflictrecord.birthDate,
        gender: this.gender,
        phone: this.phone,
        city: this.city,
        pcode: this.postalcode,
        state: this.state,
        score: this.conflicts[i].score,
        conflictId: this.conflicts[i].conflictId,
        mlpredict: this.conflicts[i].mlPrediction,
        mismatch: JSON.parse(this.conflicts[i].mismatchedElements)
      };
      this.conflictarray.push(conflictjson);
      this.conflictdataSource = new MatTableDataSource(this.conflictarray);
    }
    this.page();
  }

  link() {
    if (this.pageres.groups[0] != null) {
      const grps = this.pageres.groups[0];
      const conArray = this.conflicts;
      grps.conflicts = [];
      if (this.selection.selected.length != 0) {
        for (let i = 0; i < this.selection.selected.length; i++) {
          const selectConflict = conArray.filter(x => {
            return x.conflictId === this.selection.selected[i].conflictId;
          });
          if (selectConflict[0] !== 'undefined') {
            grps.conflicts.push(selectConflict[0]);
          }
        }
        this.patientmatchingservice.linkPatients(grps).subscribe((res: any) => {
          this.linkres = res;
          this.notification.showNotificationMsg('conflicted Record is Linked Successfully', 'success', 'success');
          this.loadpatient(this.linkres);
          this.selection = new SelectionModel(true, []);
        });
      } else {
        this.notification.showNotificationMsg('Select atleast one conflicted Record', 'warn', 'warn');
        return null;
      }
    }
  }

  exclude() {
    if (this.pageres.groups[0] != null) {
      const exgrps = this.pageres.groups[0];
      const exArray = this.conflicts;
      exgrps.conflicts = [];
      if (this.selection.selected.length != 0) {
        for (let i = 0; i < this.selection.selected.length; i++) {
          const excludedConflict = exArray.filter(x => {
            return x.recordId === this.selection.selected[i].sourceid;
          });
          if (excludedConflict[0] !== 'undefined') {
            exgrps.conflicts.push(excludedConflict[0]);
          }
        }
        this.patientmatchingservice.excludePatients(exgrps).subscribe((res: any) => {
          this.excluderes = res;
          this.notification.showNotificationMsg('conflicted Record is Excluded Successfully', 'success', 'success');
          this.loadpatient(this.excluderes);
          this.selection = new SelectionModel(true, []);
        });
      } else {
        this.notification.showNotificationMsg('Select atleast one conflicted Record', 'warn', 'warn');
        return null;
      }
    }
  }

  openDialog(ev) {
    const data = this.parsejson;
    const dialogRef = this.dialog.open(PatientDetailedviewComponent, {
      width: '1000px',
      data: { ev, data }
    });
  }

  mlstats() {
    this.patientgroups = false;
    this.stats = true;
    this.loadmlstats();
  }

  close() {
    this.patientgroups = true;
    this.stats = false;
  }

  loadmlstats() {
    this.statsarray = [];
    this.patientmatchingservice.getstats().subscribe((response: Response) => {
      this.mlres = response;
      for (let i = 0; i < this.mlres.length; i++) {
        const renderObject = {
          id: this.mlres[i].statId,
          date: this.mlres[i].createdDateTime,
          resolveconflicts: this.mlres[i].noOfResolvedConflicts,
          accuracy: this.mlres[i].accuracyOfResolvedConflicts,
          patients: this.mlres[i].totalNumberTrainset,
          overallaccuracy: this.mlres[i].overallAccuracy,
        };
        this.statsarray.push(renderObject);
      }
      this.mldataSource = new MatTableDataSource(this.statsarray);
      this.mldataSource.sort = this.matsort;
      this.mldataSource.sortingDataAccessor = (item: any, property: string): string => {
        if (typeof item[property] === 'string') {
          return item[property].toLocaleLowerCase();
        }
        return item[property];
      };
    });
  }

  applyFilter(filterValue: string) {
    this.mldataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.conflictdataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.conflictdataSource.data.forEach(row => this.selection.select(row));
  }
}
