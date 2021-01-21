import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatasourcesService } from 'src/app/datasources/datasources.service';
import { PmalConfigService } from 'src/services/pml-config.service';
import { PmalDataService } from '../pmalDataService/pmal-data.service';
import { LoaderService } from 'src/core/loader/loader.service';

@Component({
  selector: 'app-pmal-rules-config',
  templateUrl: './pmal-rules-config.component.html',
  styleUrls: ['./pmal-rules-config.component.scss']
})
export class PmalRulesConfigComponent implements OnInit {
  displayedColumns: string[] = ['ruleId', 'ruleName', 'ruleType', 'ruleDesc', 'displayDemographic', 'status', 'actions'];
  dataSource = new MatTableDataSource();
  Sort: MatSort;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  subscriptionFilter: any;
  subscriptionButton: any;
  subscriptionPagination: any;
  filterText: any;
  pageno: number;
  pagesize: any = 10;
  createRuleForm: boolean = false;
  isEdit: boolean = true;
  userDetails: any;
  pmalRulesList: any = [];
  pmalForm: FormGroup;
  pmalStatus: any = [
    { name: 'Active', id: 'active' },
    { name: 'inActive', id: 'inActive' }
  ];
  pmalRuleTypes: any = [
    { name: 'Conflicted Rule', id: 'Conflicted' },
    { name: 'Exact Match Rule', id: 'Extact' }
  ];
  pmalDemographicsList: any = [];
  constructor(private fb: FormBuilder,
    private datasrcservice: PmalDataService,
    private pmalConfigService: PmalConfigService,
    private loaderService: LoaderService) {

    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));

    this.pmalForm = this.fb.group({
      ruleType: ['', Validators.required],
      ruleName: ['', Validators.required],
      description: ['', Validators.required],
      ruleDemographic: ['', Validators.required],
      status: ['', Validators.required]
    })

    this.subscriptionFilter = this.datasrcservice.datasrcSearchData.subscribe(data => {
      this.filterText = data;
      this.dataSource.filter = this.filterText.trim();

    })

    this.subscriptionButton = this.datasrcservice.datasourcecModuleCreateBtn.subscribe(data => {
      this.pmalForm.reset();
      this.createRuleForm = true;
      this.isEdit = false;
    })

    this.subscriptionPagination = this.datasrcservice.datasrcPAgination.subscribe(data => {
      if (data) {
        let param = {
          page_no: data,
          page_size: this.pagesize
        }
        this.getPmalRules(param);
      }
    })

  }

  ngOnDestroy() {
    this.subscriptionPagination.unsubscribe();
    this.subscriptionFilter.unsubscribe();
    this.subscriptionButton.unsubscribe();
  }

  ngOnInit() {
    this.getDemographics();
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.getPmalRules(param);

  }

  sortColumn(event) {

  }

  closeform() {
    this.createRuleForm = false;
    this.pmalForm.reset();
  }

  getDemographics() {
    this.pmalConfigService.getDemographicsList().subscribe(data => {
      if (data) {
        this.pmalDemographicsList = data;
      }
    })
  }

  getPmalRules(param) {
    this.pmalConfigService.getdatasetlist(param).subscribe(data => {
      if (data) {
        this.datasrcservice.senddatasrcCountList(data);
        if ('content' in data) {
          for (let item of data.content) {
            item['status'] = ('ruleEnabled' in item && item.ruleEnabled) ? 'active' : 'inActive';
            if ('ruleDemographics' in item && item.ruleDemographics instanceof Array) {
              let selectedRules = [];
              let tempDisDemo = [];
              for (let rules of item.ruleDemographics) {
                if ('demographic' in rules) {
                  selectedRules.push(rules.demographic);
                  tempDisDemo.push(rules.demographic.demographicName);
                }
              }
              item['demographic'] = selectedRules;
              item['displayDemographic'] = tempDisDemo.join(' , ');
            }
          }
        }
        this.pmalRulesList = data.content;
        this.dataSource = new MatTableDataSource(this.pmalRulesList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  onSubmit(type) {
    if (!this.pmalForm.valid) {
      this.validateAllFields(this.pmalForm);
      return;
    }

    let parm = {
      createdUserName: this.userDetails.firstName,
      demographics: this.pmalForm.value.ruleDemographic,
      ruleDesc: this.pmalForm.value.description,
      ruleEnabled: this.pmalForm.value.status == 'active' ? true : false,
      ruleName: this.pmalForm.value.ruleName,
      ruleType: this.pmalForm.value.ruleType
    }

    if (type == 'create') {
      this.pmalConfigService.createRules(parm).subscribe(data => {
        this.loaderService.showNotificationMsg('Config Rule Created', 'success', 'success');
        this.createRuleForm = false;
        this.isEdit = false;
        let param = {
          page_no: this.pageno,
          page_size: this.pagesize
        }
        this.getPmalRules(param);
      })
    } else if (type == 'update') {
      parm['ruleId'] = this.selectedElement.ruleId;
      this.pmalConfigService.updateRules(parm).subscribe((data: any) => {
        this.loaderService.showNotificationMsg('Config Rule Updated', 'success', 'success');
        let param = {
          page_no: this.pageno,
          page_size: this.pagesize
        }
        this.getPmalRules(param);
        this.createRuleForm = false;
        this.isEdit = false;
      })
    }

  }

  selectedElement: any;
  editdatasource(element) {
    this.selectedElement = element;
    this.isEdit = true;
    this.createRuleForm = true;
    let checkOptions = [];

    if ('demographic' in element && element.demographic instanceof Array) {
      for (let rules of element.demographic) {
        const toSelect = this.pmalDemographicsList.find(c => c.demographicId == rules.demographicId);
        checkOptions.push(toSelect);
      }
    }

    this.pmalForm.patchValue({
      description: element.ruleDesc,
      ruleName: element.ruleName,
      ruleType: element.ruleType,
      status: element.ruleEnabled ? 'active' : 'inActive',
      ruleDemographic: checkOptions
    })

  }

  ondelete(element) {
    this.pmalConfigService.deleteRules(element.ruleId).subscribe(data => {
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.getPmalRules(param);
    })
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
