import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort, Sort, MatSelectChange, MatTableDataSource } from '@angular/material';
import { UserDataService } from '../userdataservice/user-data.service';
import { UserDashboardService } from 'src/services/userdashboard.services';

@Component({
  selector: 'app-pmal',
  templateUrl: './pmal.component.html',
  styleUrls: ['./pmal.component.scss']
})
export class PmalComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) Sort: MatSort;
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  displayedColumns: string[] = ['extractionId', 'createdDateTime', 'totalPatients', 'automaticMatchedPatients', 'totalUniques', 'manuallyMatchedPatients', 'totalConflicts'];
  dataSource = new MatTableDataSource;
  searchForm: FormGroup;
  filterText: any;

  pageno: any = 1;
  pagesize: any = 10;

  subscriptionFilter: any;
  subscriptionPagination: any;

  pmalData: any = [];

  constructor(private fb: FormBuilder,
    private userdataservice: UserDataService,
    private userDashboardService: UserDashboardService) {
    this.subscriptionFilter = this.userdataservice.userDashboardFilterData.subscribe(data => {
      this.filterText = data;
      this.dataSource.filter = this.filterText.trim();
    })

    this.subscriptionPagination = this.userdataservice.userDashboardPagination.subscribe(data => {
      let param = {
        page_no: data,
        page_size: this.pagesize
      }
      this.getPMALdata(param);
    })

  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      gender: [''],
    });

    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.getPMALdata(param);

  }

  getPMALdata(param) {
    this.userDashboardService.getPMALdata(param).subscribe(data => {
      if (data && 'results' in data) {
        this.pagesize = data.pageSize;
        this.pmalData = data.results;
        this.userdataservice.sendUserDashboardCount(data);
        this.dataSource = new MatTableDataSource<any>(this.pmalData);
        this.dataSource.sort = this.Sort;
        // this.dataSource.sortingDataAccessor = (item: any, property: string): string => {
        //   if (typeof item[property] === 'string') {
        //     return item[property].toLocaleLowerCase();
        //   }
        //   return item[property];
        // };
      }
    })
  }

  ngOnDestroy() {
    this.subscriptionPagination.unsubscribe();
    this.subscriptionFilter.unsubscribe();
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
