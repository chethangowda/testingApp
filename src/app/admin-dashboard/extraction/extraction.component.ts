import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminDashboardService } from 'src/services/admindashboard.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatSelectChange } from '@angular/material';
import { AdmindataService } from '../admindataServices/admindata.service';

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['./extraction.component.scss']
})
export class ExtractionComponent implements OnInit {
  Sort: MatSort;
  displayedColumns: string[] = ['dataSourceName', 'extractionId', 'extractionStartTime', 'extractionEndTime', 'status', 'transformationStatus', 'idMatchingStatus', 'deDuplicationStatus'];
  dataSource = new MatTableDataSource();
  searchForm: FormGroup;

  extractionList: any = [];
  filterText: any;
  subscriptionPagination: any;
  subscriptionFilter: any;
  subscriptionButton: any;
  timer: any;
  pageno: number;
  pagesize: number = 10;

  @ViewChild(MatSort, { static: false }) set page(Sort: MatSort) {
    this.Sort = Sort;
    this.dataSource.sort = this.Sort;
  };
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  constructor(private fb: FormBuilder, private adminDashboardService: AdminDashboardService, private auditdataservice: AdmindataService) {

    this.subscriptionFilter = this.auditdataservice.auditSearchData.subscribe(data => {
      this.filterText = data;
      this.dataSource.filter = this.filterText.trim();
    })

    this.subscriptionPagination = this.auditdataservice.auditPAgination.subscribe(data => {
      if (data) {
        let param = {
          page_no: data,
          page_size: this.pagesize
        }
        this.paginationAPIcall(param, false);
      }
    })

    this.timer = setInterval(() => {
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.paginationAPIcall(param, true);
    }, 5000);
  }

  ngOnInit() {
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.paginationAPIcall(param, false);
  }

  ngOnDestroy() {
    this.subscriptionPagination.unsubscribe();
    this.subscriptionFilter.unsubscribe();
    clearInterval(this.timer);
  }

  refresh() {
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.paginationAPIcall(param, false);
  }

  paginationAPIcall(URLparam, loader) {
    this.adminDashboardService.paginationextractionData(URLparam, loader).subscribe(data => {
      if (data) {
        this.pagesize = data.pageSize;
        this.auditdataservice.sendauditCountList(data);
        const extractiondata = data.results;
        this.pageno = data.pageNo;
        if (extractiondata) {
          for (let item of extractiondata) {
            if ('dataProcessingStatus' in item) {
              let processingStatus = JSON.parse(item['dataProcessingStatus']);
              if (processingStatus instanceof Object) {
                item['transformationStatus'] = 'transformationStatus' in processingStatus ? processingStatus.transformationStatus : '';
                item['qualityStatus'] = 'qualityStatus' in processingStatus ? processingStatus.qualityStatus : '';
                item['idMatchingStatus'] = 'idMatchingStatus' in processingStatus ? processingStatus.idMatchingStatus : '';
                item['deDuplicationStatus'] = 'deDuplicationStatus' in processingStatus ? processingStatus.deDuplicationStatus : '';
              }
            }
          }
        }
        this.extractionList = extractiondata;
        this.dataSource = new MatTableDataSource(this.extractionList);
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
}
