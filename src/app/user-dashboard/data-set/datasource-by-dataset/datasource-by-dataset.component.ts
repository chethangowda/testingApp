import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, Sort, MatSelectChange, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-datasource-by-dataset',
  templateUrl: './datasource-by-dataset.component.html',
  styleUrls: ['./datasource-by-dataset.component.scss']
})
export class DatasourceByDatasetComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() childMessage: any;
  dataSourcecList: any = [];
  displayedColumns: string[] = ['dataSourceId', 'dataSourceName', 'endPointUrl', 'isSecure', 'connectorId'];
  Sort: MatSort;
  dataSource = new MatTableDataSource;
  @ViewChild(MatSort, { static: false }) set page(Sort: MatSort) {
    this.Sort = Sort;
    this.dataSource.sort = this.Sort;
  };
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };

  constructor() {

  }

  onFilter(event) {
    let searchText = event.target.value;
    this.dataSource.filter = searchText.trim();
  }

  getConnectorType(connectorID) {
    if (connectorID) {
      if (connectorID == 1) {
        return 'Flat File'
      } else if (connectorID == 2) {
        return 'Fhir'
      } else if (connectorID == 3) {
        return 'CCDA'
      }
    } else {
      return '-'
    }
  }

  ngOnInit() {
    this.dataSourcecList = this.childMessage;
    this.dataSource = new MatTableDataSource<any>(this.dataSourcecList);
    this.dataSource.data = this.dataSourcecList;
    this.dataSource.sort = this.Sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.Sort;
    this.dataSource.sortingDataAccessor = (item: any, property: string): string => {
      if (typeof item[property] === 'string') {
        return item[property].toLocaleLowerCase();
      }
      return item[property];
    };
  }

  onPageChange(event) {
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
