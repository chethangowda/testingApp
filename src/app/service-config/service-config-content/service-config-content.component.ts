import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, Sort, MatDialog, MatSelectChange } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SecurityConfigService } from 'src/services/security-config.service';
import { StatusDialogComponent } from 'src/app/security-config/status-dialog/status-dialog.component';

@Component({
  selector: 'app-service-config-content',
  templateUrl: './service-config-content.component.html',
  styleUrls: ['./service-config-content.component.scss']
})
export class ServiceConfigContentComponent implements OnInit {
  displayedColumns: string[] = ['systemValueId', 'category', 'key', 'value', 'active', 'actions'];
  dataSource = new MatTableDataSource();
  eventForm: FormGroup;
  searchForm: FormGroup;
  validjson: boolean = false;
  jsonarray: any = [];
  Sort: MatSort;
  isedit: boolean = true;
  editvalue: boolean = false;
  editRowId: number = -1;
  services: any = [];
  configdataToPage: any;
  pageno: any;
  pagesize: any;
  configlist: any;
  event: any;
  serviceTypes: any;
  @ViewChild(MatSort, { static: false }) set page(Sort: MatSort) {
    this.Sort = Sort;
    this.dataSource.sort = this.Sort;
  };
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };

  constructor(private fb: FormBuilder, private configservice: SecurityConfigService, private dialog: MatDialog) {
    this.searchForm = this.fb.group({
      serviceselect: [''],
    });

    this.eventForm = this.fb.group({
      service: [''],
      key: [''],
      value: [''],
      json: ['']
    })
    let param = {};
    this.configservice.getsystemconfigList(param).subscribe(data => {
      this.configlist = data;
    })
  }

  ngOnInit() {
    let param = {
    }
    this.getConfigList(param)
  }

  onSearchFilter(event) {
    this.dataSource.filter = event.trim();
  }

  onPaginationCall(event) {
    let param = {
    }
    this.getConfigList(param);
  }

  getConfigList(param) {
    this.configservice.getsystemconfigList(param).subscribe(data => {
      this.configdataToPage = data;
      if (data) {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.data = data;
        this.dataSource.sort = this.Sort;
        this.dataSource.sortingDataAccessor = (item: any, property: string): string => {
          if (typeof item[property] === 'string') {
            return item[property].toLocaleLowerCase();
          }
          return item[property];
        };
      }
    })
  }

  editconfig(row, element) {
    this.isedit = false;
    this.editvalue = true;
    this.editRowId = row;
  }

  updateconfig(element) {
    this.event = element
    let param = {
      active: element.active
    }
    this.Saveconfig(param);
  }

  Saveconfig(param) {
    param['systemValueId'] = this.event.systemValueId;
    param['category'] = this.event.category;
    param['key'] = this.event.key;
    param['value'] = this.event.value;
    param['visible'] = this.event.visible;
    this.configservice.updateconfigList(param).subscribe(data => {
      this.eventForm.reset();
      this.editRowId = -1;
      let param = {
      }
      this.getConfigList(param);
    })

  }

  search() {
    let param = {}
    param['category'] = this.searchForm.value.serviceselect;
    this.getConfigList(param);
  }

  reset() {
    this.searchForm.reset();
    let param = {
    }
    this.getConfigList(param)
  }

  deactivategroup(ev) {
    const x = ev;
    this.event = ev;
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      data: { x }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== '' && result !== undefined) {
        if (result.x.active == false) {
          let param = {
            active: true
          }
          this.Saveconfig(param)
        }
        else if (result.x.active == true) {
          let param = {
            active: false
          }
          this.Saveconfig(param)
        }
      }
    })
  }

  cancelconfig(element) {
    this.editRowId = -1;
    let param = {
    }
    this.getConfigList(param);
  }

  setDirection({ value }: MatSelectChange): void {
    this.Sort.sort({
      id: this.sort.active,
      start: value,
      disableClear: true,
    });
  }

  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;
    }
  }

  onSubmit() {

  }

}
