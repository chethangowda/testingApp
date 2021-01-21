import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { QUERY_BUILDER_DATA, QUERY_BUILDER_DATA_NEW } from './cohort-query-builder.data';
import { QueryItem } from '../shared/query-item';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeNestedDataSource, MatDialog } from '@angular/material';
import { of as observableOf } from 'rxjs';
import { CohortqueryService } from 'src/services/cohortquery.service';
import { CohortDataService } from '../shared/cohortDataservice';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CohortModalComponent } from '../cohort-modal/cohort-modal.component';
import { LoaderService } from 'src/core/loader/loader.service';

@Component({
  selector: 'app-cohort-query-builder',
  templateUrl: './cohort-query-builder.component.html',
  styleUrls: ['./cohort-query-builder.component.scss']
})
export class CohortQueryBuilderComponent implements OnInit {
  @Output() updatequerylist = new EventEmitter<any>();
  groups: any[] = [];
  conditions: any[];
  conditionModes: any[] = [
    { id: 'equals', label: 'Equals' },
    { id: 'notEquals', label: 'Not Equals' },
  ];

  treeControl = new NestedTreeControl<any>(node => node.values);
  dataSource = new MatTreeNestedDataSource<any>();

  cohortForm: FormGroup = new FormGroup({})

  constructor(private cohortqueryService: CohortqueryService,
    private cohortDataService: CohortDataService,
    private dialog: MatDialog,
    private loaderService: LoaderService) {

  }


  hasChild = (_: number, node: any) => !!node.values && node.values.length > 0;


  ngOnInit() {
    this.getCohortCondition();
  }

  getCohortCondition() {
    this.cohortqueryService.getConditions().subscribe(data => {
      if (data) {
        this.conditions = data;
        this.dataSource.data = this.conditions;
      }
    })
  }

  addGroup() {
    this.groups.push({ conditions: [] });
  }

  removeGroup(group: any) {
    this.groups.splice(this.groups.findIndex(g => g === group), 1);
  }

  addCondition(group: any, condition) {
    const groupCondition: any = {
      ...condition.input,
      groupName: condition.group,
    };

    this.cohortForm.addControl(condition.input.displayName, new FormControl('', Validators.required))

    if ('comparator' in condition.input && condition.input.comparator && condition.input.comparator instanceof Array) {
      this.cohortForm.controls[condition.input.displayName].setValue(condition.input.comparator[0])
      groupCondition['selectedComparator'] = condition.input.comparator[0];
    }

    if (!groupCondition.inputType) {
      groupCondition.value = groupCondition.title;
    }

    if (groupCondition.inputType === 'text') {
      groupCondition.caseSensitive = groupCondition.comparator[0].id;
      groupCondition.value = '';
    }

    if (groupCondition.inputType === 'quantity') {
      groupCondition.value = [0, 0];
    }

    if (groupCondition.inputType === 'period') {
      groupCondition.value = { from: null, to: null };
    }

    if (group.conditions.length <= 0) {
      group.conditions.push(groupCondition);
    } else if (group.conditions.length > 0) {
      if (!group.conditions.some(e => { return JSON.stringify(groupCondition) == JSON.stringify(e) })) {
        group.conditions.push(groupCondition);
      }
    }

  }

  onExecute(type) {
    if (!this.cohortForm.valid) {
      return;
    }

    let conditionArray = [];
    if (this.groups.length > 0) {
      for (let item of this.groups) {
        if ('conditions' in item && item.conditions instanceof Array && item.conditions.length > 0) {
          let conditionArr = { conditions: [] };
          for (let cond of item.conditions) {
            let tempObj = {};
            tempObj['queryId'] = ('cohortValueSetId' in cond && cond.cohortValueSetId) ? cond.cohortValueSetId : cond.cohortValueId
            tempObj['operatorId'] = this.cohortForm.value[cond.displayName].cohortOperatorId
            tempObj['type'] = 'queryType' in cond ? cond.queryType : ''
            conditionArr.conditions.push(tempObj)
          }
          conditionArray.push(conditionArr)
        }
      }
    }

    let queryParam = {
      conditions: conditionArray,
      saveQuery: false,
      execute: true
    }

    if (conditionArray.length > 0) {
      const x = type;

      if (type == 'execute') {
        let param = {
          'search-offset': 0,
          '_count': 10,
        }
        this.cohortDataService.sendCohortExecuteQueryData({ param: queryParam, urlParam: this.getQueryParameter(param) });

      } else {
        const executedialogRef = this.dialog.open(CohortModalComponent, {
          // width: '40%',
          data: { x }
        });
        executedialogRef.afterClosed().subscribe(result => {
          if (result) {
            queryParam['execute'] = (type == 'execute' ? true : false);
            if (result.queryName) {
              queryParam['queryName'] = result.queryName;
            }
            queryParam['saveQuery'] = true;
            // if(type == 'execute'){
            //   let param = {
            //     'search-offset': 0,
            //     '_count': 10,
            //   }
            //   this.cohortDataService.sendCohortExecuteQueryData({param: queryParam, urlParam: this.getQueryParameter(param)});
            // } else if(type == 'save') {
            let param = {
              'search-offset': 0,
              '_count': 10,
            }
            this.cohortqueryService.saveQuery(queryParam, this.getQueryParameter(param)).subscribe(data => {
              this.loaderService.showNotificationMsg(data.msg, 'success', 'success');
              this.updatequerylist.emit(true);
            })
            // }
          }
        })
      }

    }
  }

  getQueryParameter(param) {
    let queryParams: string = '';
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        queryParams += `${key}=${param[key]}&`;
      }
    }

    queryParams = queryParams.slice(0, -1);
    return queryParams
  }

  onClearAll() {
    this.groups = [];
  }

  removeCondition(group: any, condition: QueryItem) {
    group.conditions.splice(group.conditions.findIndex(c => c === condition), 1);
  }

  noReturnPredicate() {
    return false;
  }
}
