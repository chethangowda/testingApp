import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, Sort, MatSelectChange } from '@angular/material';
import { DatasourceService } from 'src/services/datasourcec.service';
import { DatasourcesService } from '../datasources.service';

@Component({
  selector: 'app-agent-content',
  templateUrl: './agent-content.component.html',
  styleUrls: ['./agent-content.component.scss']
})
export class AgentContentComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['agentname', 'status', 'actions'];
  data: any = [];
  agentlist: any = [];
  statuscolor: string;
  startbtn: boolean;
  stopbtn: boolean;
  restartbtn: boolean;
  pageno: number = 1;
  pagesize: number = 10;
  agentdata: any;
  agenttotal: number;
  fromRecordCount: number;
  toRecordCount: number = 0;
  @ViewChild(MatSort, { static: true }) Sort: MatSort;
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  page_no: any;
  filterText: any;
  timer: any;
  subscriptionPagination: any;
  subscriptionFilter: any;
  subscriptionButton: any;

  constructor(private datasrcservice: DatasourceService, private dataservice: DatasourcesService) {
    this.subscriptionFilter = this.dataservice.datasrcSearchData.subscribe(data => {
      this.filterText = data;
      this.dataSource.filter = this.filterText.trim();
    })

    this.subscriptionPagination = this.dataservice.datasrcPAgination.subscribe(data => {
      if (data) {
        let param = {
          page_no: data,
          page_size: this.pagesize
        }
        this.paginationAPIcall(param, false);
      }
    })

    this.starttimer();

  }


  starttimer() {
    this.timer = setInterval((time) => {
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.paginationAPIcall(param, true);
    }, 10000);
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
    clearInterval(this.timer);
    this.datasrcservice.getagentlist(URLparam, loader).subscribe((data) => {
      this.starttimer();
      this.dataservice.senddatasrcCountList(data);
      this.agentlist = [];
      this.agentdata = data.results;
      this.agenttotal = data.totalRecords;
      this.pageno = data.pageNo;
      this.page_no = data.pageNo;
      this.fromRecordCount = data.pageNo;
      this.toRecordCount = this.agentdata.length;
      for (let i = 0; i < this.agentdata.length; i++) {
        if (this.agentdata[i].serverStatus === "Running") {
          this.statuscolor = 'lime',
            this.startbtn = true;
          this.stopbtn = false;
          this.restartbtn = false;
        } else if (this.agentdata[i].serverStatus === "Stopped") {
          this.statuscolor = 'yellow';
          this.startbtn = false;
          this.stopbtn = true;
          this.restartbtn = true;
        }
        else if (this.agentdata[i].serverStatus === "Failed") {
          this.statuscolor = 'orangered';
          this.startbtn = true;
          this.stopbtn = true;
          this.restartbtn = true;
        }
        const agentobject = {
          agentname: this.agentdata[i].agentName,
          status: this.agentdata[i].serverStatus,
          color: this.statuscolor,
          startbtn: this.startbtn,
          stopbtn: this.stopbtn,
          restartbtn: this.restartbtn,
          agentId: this.agentdata[i].agentId
        }
        this.agentlist.push(agentobject);
      }
      this.dataSource = new MatTableDataSource(this.agentlist);
      this.dataSource.sort = this.Sort;
      this.dataSource.sortingDataAccessor = (item: any, property: string): string => {
        if (typeof item[property] === 'string') {
          return item[property].toLocaleLowerCase();
        }
        return item[property];
      };
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  start(element) {
    clearInterval(this.timer);
    const id = element.agentId;
    const cmd = 'start';
    this.executeagent(id, cmd)
  }

  stop(element) {
    clearInterval(this.timer);
    const id = element.agentId;
    const cmd = 'stop';
    this.executeagent(id, cmd)
  }

  restart(element) {
    clearInterval(this.timer);
    const id = element.agentId;
    const cmd = 'restart';
    this.executeagent(id, cmd)
  }

  executeagent(id, cmd) {
    this.datasrcservice.agentexecution(id, cmd).subscribe((data) => {
      const json = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.paginationAPIcall(json, false)
    }, error => {
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
