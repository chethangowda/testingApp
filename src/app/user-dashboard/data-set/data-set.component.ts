import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDashboardService } from 'src/services/userdashboard.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange, yearsPerPage } from '@angular/material';
import { UserDataService } from '../userdataservice/user-data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-set',
  templateUrl: './data-set.component.html',
  styleUrls: ['./data-set.component.scss']
})
export class DataSetComponent implements OnInit {
  displayedColumns: string[] = ['dataSetId', 'dataSetName', 'lastUpdated', 'fromdate', 'scheduleFrequency'];
  dataSource = new MatTableDataSource;
  searchForm: FormGroup;
  Sort: MatSort;
  originaltime: any;
  get isShowingDetails(): boolean {
    return !!this.showingDetailsFor;
  }

  @ViewChild(MatSort, { static: false }) set page(Sort: MatSort) {
    this.Sort = Sort;
    this.dataSource.sort = this.Sort;
  };
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };


  showingDetailsFor: any;
  datasetList: any;
  filterText: any;

  pageno: any;
  pagesize: any;

  subscriptionFilter: any;
  subscriptionPagination: any;

  constructor(private userDashboardService: UserDashboardService, private userdataservice: UserDataService,
    private fb: FormBuilder,
    private datePipe: DatePipe) {
    this.subscriptionFilter = this.userdataservice.userDashboardFilterData.subscribe(data => {
      this.filterText = data;
      this.dataSource.filter = this.filterText.trim();
    })

    this.subscriptionPagination = this.userdataservice.userDashboardPagination.subscribe(data => {
      let param = {
        page_no: data,
        page_size: this.pagesize
      }
      this.getDataSetListCall(param);
    })

  }

  ngOnInit() {
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.getDataSetListCall(param);

  }

  tConvert(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    this.originaltime = time.join('')
  }

  checkItemIsSelected(time) {
    var t1 = this.datePipe.transform(new Date(), 'HH:mm');
    if ((time) > (t1)) {
      return true;
    }
    else {
      return false;
    }
  }

  checkmonthIsSelected(time) {
    var t1 = this.datePipe.transform(new Date(time), 'yyyy-MM-dd');
    var t2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    if (t2 === t1) {
      return 'yes';
    }
    else if ((t2) < (t1)) {
      return 'true';
    }
    else {
      return 'false';
    }

  }

  setDay(date, dayOfWeek) {
    date = new Date(date.getTime());
    date.setDate(date.getDate() + (7 + dayOfWeek - date.getDay() - 1) % 7 + 1);
    return date;
  }

  getDay(date, dayOfWeek) {
    date = new Date(date.getTime());
    date.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return date;
  }

  getDataSetListCall(param) {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    this.userDashboardService.getDataSetList(param).subscribe(datasetData => {
      if (datasetData && 'results' in datasetData) {
        this.pagesize = datasetData.pageSize;
        this.userdataservice.sendUserDashboardCount(datasetData);
        this.datasetList = datasetData.results;
        for (let item of this.datasetList) {
          this.tConvert(item.scheduleTime);
          if (item['scheduleFrequency'] === 'Daily') {
            if (!this.checkItemIsSelected(item.scheduleTime)) {
              item['nextext'] = this.datePipe.transform((new Date().setDate(new Date().getDate() + 1)))
            }
            else {
              item['nextext'] = this.datePipe.transform((new Date()))
            }
            item['nexttime'] = this.originaltime;
          }

          if (item['scheduleFrequency'] === 'Weekly') {
            var cnt = -1;
            for (let w_item of weekday) {
              cnt++
              if (w_item === item.weekday) {
                break;
              }
            }
            if (!this.checkItemIsSelected(item.scheduleTime)) {
              item['nextext'] = this.setDay(new Date(), cnt)
            }
            else {
              item['nextext'] = this.getDay(new Date(), cnt)
            }
            item['nexttime'] = this.originaltime;
          }

          if (item['scheduleFrequency'] === 'Monthly') {

            if ((this.checkmonthIsSelected(item.monthdate) === 'yes')) {
              if (this.checkItemIsSelected(item.scheduleTime)) {
                item['nextext'] = this.datePipe.transform(new Date(item.monthdate))
              }
              else {
                item['nextext'] = this.datePipe.transform((new Date(item.monthdate).setMonth(new Date(item.monthdate).getMonth() + 1)))
              }
            }
            else if ((this.checkmonthIsSelected(item.monthdate) === 'false')) {
              item['nextext'] = this.datePipe.transform((new Date(item.monthdate).setMonth(new Date(item.monthdate).getMonth() + 1)))

              if (new Date(item['nextext']) <= new Date()) {
                for (let i = 1; i < i + 1; i++) {
                  if (new Date(item['nextext']) < new Date()) {
                    item['nextext'] = this.datePipe.transform((new Date(item.nextext).setMonth(new Date(item.nextext).getMonth() + 1)))
                  }
                  else {
                    if (this.checkItemIsSelected(item.scheduleTime) && (new Date(item['nextext']) === new Date())) {
                      item['nextext'] = this.datePipe.transform((new Date(item.nextext).setMonth(new Date(item.nextext).getMonth() - 1)))
                    }
                    break;
                  }
                }

              }
            }

            else if ((this.checkmonthIsSelected(item.monthdate) === 'true')) {
              item['nextext'] = this.datePipe.transform(new Date(item.monthdate))
            }

            item['nexttime'] = this.originaltime;
          }
          this.dataSource = new MatTableDataSource<any>(this.datasetList);
          this.dataSource.data = this.datasetList;
          this.dataSource.sort = this.Sort;
        }
      }
    })
  }

  ngOnDestroy() {
    this.subscriptionPagination.unsubscribe();
    this.subscriptionFilter.unsubscribe();
  }

  isExpand: boolean = false;
  toggleDetails(patient: any) {
    this.showingDetailsFor = this.showingDetailsFor === patient ? null : patient;
  }

  isShowingDetailsFor(patient: any): boolean {
    return this.showingDetailsFor === patient;
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
