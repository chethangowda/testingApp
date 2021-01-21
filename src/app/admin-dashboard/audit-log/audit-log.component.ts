import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminDashboardService } from 'src/services/admindashboard.service';
import { MatTableDataSource, MatSort, Sort, MatSelectChange } from '@angular/material';
import { AdmindataService } from '../admindataServices/admindata.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit {

  displayedColumns: string[] = ['userName', 'category', 'createdDateTime', 'eventName', 'viewevent'];
  dataSource = new MatTableDataSource;
  searchForm: FormGroup;
  auditList: any[];
  auditres: any[];
  filterText: any;
  @ViewChild(MatSort, { static: true }) Sort: MatSort;
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  showingDetailsFor: boolean;
  subscriptionPagination: any;
  subscriptionFilter: any;
  subscriptionButton: any;
  pageno: number;
  pagesize: number = 10;

  constructor(private fb: FormBuilder,
    private adminDashboardService: AdminDashboardService, private auditdataservice: AdmindataService, private datePipe: DatePipe) {

    this.subscriptionFilter = this.auditdataservice.auditSearchData.subscribe(data => {
      this.filterText = data;
      this.dataSource.filter = this.filterText.trim();
    })

    this.subscriptionPagination = this.auditdataservice.auditPAgination.subscribe(data => {
      if (data) {
        let param = {
          // page_no : data,
          // page_size : this.pagesize
        }
        param['page_no'] = data;
        param['page_size'] = this.pagesize;
        if (this.searchForm.value.category) {
          param['category'] = this.searchForm.value.category;
        }
        if (this.searchForm.value.freq === 'Week') {
          param['timestamp_lt'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
          param['timestamp_gt'] = this.datePipe.transform((new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd');
        }
        if (this.searchForm.value.freq === 'Month') {
          param['timestamp_lt'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
          param['timestamp_gt'] = this.datePipe.transform((new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd');
        }
        this.paginationAPIcall(param);
      }
    })
  }

  ngOnDestroy() {
    this.subscriptionPagination.unsubscribe();
    this.subscriptionFilter.unsubscribe();
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      category: [''],
      freq: ['']
    });
    this.getAuditList();
  }

  toggleDetails(row) {
    this.showingDetailsFor = this.showingDetailsFor === row.eventdata ? null : row.eventdata;
  }

  isShowingDetailsFor(row): boolean {
    return this.showingDetailsFor === row.eventdata;
  }

  paginationAPIcall(URLparam) {
    this.adminDashboardService.paginationauditData(URLparam).subscribe(data => {
      if (data) {
        this.pagesize = data.pageSize;
        this.auditdataservice.sendauditCountList(data);
        this.auditList = [];
        for (let i = 0; i < data.results.length; i++) {
          const auditobj = {
            category: data.results[i].category,
            userName: data.results[i].userName,
            createdDateTime: data.results[i].createdDateTime,
            eventName: data.results[i].eventName,
            eventdata: JSON.parse(data.results[i].eventData)
          };
          this.auditList.push(auditobj);
        }
        this.dataSource = new MatTableDataSource(this.auditList);
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

  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;
    }
  }

  setDirection({ value }: MatSelectChange): void {
    this.Sort.sort({
      id: this.sort.active,
      start: value,
      disableClear: true,
    });
  }

  getAuditList() {
    this.adminDashboardService.getAuditLogList().subscribe(auditdata => {
      this.auditres = auditdata;
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.paginationAPIcall(param);
    })
  }

  search() {
    let param = {}
    if (this.searchForm.value.category) {
      param['category'] = this.searchForm.value.category;
    }
    if (this.searchForm.value.freq === 'Week') {
      param['timestamp_lt'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      param['timestamp_gt'] = this.datePipe.transform((new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd');
    }
    if (this.searchForm.value.freq === 'Month') {
      param['timestamp_lt'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      param['timestamp_gt'] = this.datePipe.transform((new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd');
    }
    param['page_no'] = this.pageno;
    param['page_size'] = this.pagesize;
    this.auditList = [];
    this.paginationAPIcall(param);
  }

  reset() {
    this.searchForm.reset();
    this.getAuditList();
  }

}
