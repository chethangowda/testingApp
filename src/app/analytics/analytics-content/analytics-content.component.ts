import { Component, OnInit, ViewChild, ViewEncapsulation, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { GENDERS } from '../shared';
import { PatientViewService } from 'src/services/patientview_sevice';
import { PatientDataService } from '../dataServices/data.service';
import { MatSelectChange } from '@angular/material';
import { CohortDataService } from 'src/app/cohort-query/shared/cohortDataservice';
import { CohortqueryService } from 'src/services/cohortquery.service';
import { DataserviceGeneral } from 'src/app/shared/dataserviceGeneral/dataservicegeneral';
import { MdePopoverTrigger } from '@material-extended/mde';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-analytics-content',
  templateUrl: './analytics-content.component.html',
  styleUrls: ['./analytics-content.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AnalyticsContentComponent implements OnInit {
  @ViewChild('target', { static: false, read: ElementRef }) target: MdePopoverTrigger;
  @ViewChild(MatTable, { static: false, read: ElementRef }) private matTableRef: ElementRef;
  @Input() isFromPage;
  @Input() queryDatajson;
  columns: any[] = [
    { field: 'Interopxid', width: 100, dcName: 'Interopxid' },
    { field: 'FamilyName', width: 100, dcName: 'FamilyName' },
    { field: 'GivenName', width: 100, dcName: 'GivenName' },
    { field: 'Gender', width: 100, dcName: 'Gender' },
    { field: 'BirthDate', width: 100, dcName: 'BirthDate' },
    { field: 'Address', width: 100, dcName: 'Address' },
    { field: 'Age', width: 100, dcName: 'Age' },
    { field: 'Organization', width: 100, dcName: 'Organization' },
    { field: 'Practitioner', width: 100, dcName: 'Practitioner' },
    { field: 'Practitioner Role', width: 100, dcName: 'PractitionerRole' },
    { field: 'Identifier', width: 100, dcName: 'Identifier' },
    { field: 'Alive', width: 100, dcName: 'Alive' },
    { field: 'Deceased', width: 100, dcName: 'Deceased' },
    { field: 'Language', width: 100, dcName: 'Language' },
    { field: 'Telecom', width: 100, dcName: 'Telecom' },
    { field: 'Creation/Updation Time', width: 100, dcName: 'CreationTime' },
    // {field: 'Updation Time', width: 100, dcName: 'UpdationTime'},
    { field: 'Birth Sex', width: 100, dcName: 'BirthSex' },
    { field: 'Race', width: 100, dcName: 'Race' },
    { field: 'Ethnicity', width: 100, dcName: 'Ethnicity' },
    { field: 'Mothers Maiden Name', width: 100, dcName: 'MothersMaidenName' }
  ];
  displayedColumns: string[] = ['Interopxid', 'FamilyName', 'GivenName', 'Gender', 'BirthDate', 'Address', 'Age',
    'Organization', 'Practitioner', 'Practitioner Role', 'Identifier', 'Alive', 'Deceased', 'Language', 'Telecom',
    'Creation/Updation Time', 'Birth Sex', 'Race', 'Ethnicity', 'Mothers Maiden Name'];
  dataSource = new MatTableDataSource;
  searchForm: FormGroup;
  genders = GENDERS;
  get isShowingDetails(): boolean {
    return !!this.showingDetailsFor;
  }

  hiperLinkColumns: any = [
    'Organization', 'Practitioner', 'PractitionerRole'
  ];

  @ViewChild(MatSort, { static: true }) Sort: MatSort;
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };

  showingDetailsFor: any;
  patientList: any = [];
  filterText: any;

  inputReadonly: boolean = true;

  patientSearchSubscribe: any;
  patientPaginationSubscribe: any;
  cohortquerySubscription: any;
  temporganizationRef: any = [];
  queryParam: any;
  urlParam: any;
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;

  elementData: any;

  constructor(private fb: FormBuilder,
    private patientViewService: PatientViewService,
    private patientDataService: PatientDataService,
    private dataPipe: DatePipe,
    private cohortDataService: CohortDataService,
    private cohortqueryService: CohortqueryService,
    private renderer: Renderer2,
    private dataServiceGeneral: DataserviceGeneral) {

    this.cohortquerySubscription = this.cohortDataService.executeQueryData.subscribe(data => {
      this.queryParam = data.param;
      this.urlParam = data.urlParam;
      this.getCohortSearchList(this.queryParam, this.urlParam);
    });

    this.patientSearchSubscribe = this.patientDataService.patientSearchData.subscribe(data => {
      this.filterText = data;
      this.dataSource.filter = this.filterText.trim();
    });

    this.patientPaginationSubscribe = this.patientDataService.patientPAgination.subscribe(data => {
      if (data) {
        this.paginationAPIcall(data);
      }
    });
  }

  // Resize table columns width

  ngAfterViewInit() {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  setTableResize(tableWidth: number) {
    let totWidth = 0;
    this.columns.forEach((column) => {
      totWidth += column.width;
    });
    const scale = (tableWidth - 5) / totWidth;
    this.columns.forEach((column) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
  }

  setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
  }


  onResizeColumn(event: any, index: number) {
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    event.preventDefault();
    this.mouseMove(index);
  }

  private checkResizing(event, index) {
    const cellData = this.getCellData(index);
    if ((index === 0) || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.columns.length - 1)) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number) {
    const headerRow = this.matTableRef.nativeElement.children[0].children[0];
    const cell = headerRow.children[index];
    return cell.getBoundingClientRect();
  }

  mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 50) {
          this.setColumnWidthChanges(index, width);
        }
      }
    });
    this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
      if (this.pressed) {
        this.pressed = false;
        this.currentResizeIndex = -1;
        this.resizableMousemove();
        this.resizableMouseup();
      }
    });
  }

  setColumnWidthChanges(index: number, width: number) {
    const orgWidth = this.columns[index].width;
    const dx = width - orgWidth;
    if (dx !== 0) {
      const j = (this.isResizingRight) ? index + 1 : index - 1;
      const newWidth = this.columns[j].width - dx;
      if (newWidth > 50) {
        this.columns[index].width = width;
        this.setColumnWidth(this.columns[index]);
        this.columns[j].width = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
    }
  }

  setColumnWidth(column: any) {
    const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.field));
    columnEls.forEach((el: HTMLDivElement) => {
      el.style.width = column.width + 'px';
    });
  }

  getCohortSearchList(param, urlParam) {
    this.cohortqueryService.executeQuery(param, urlParam).subscribe(data => {
      if (data && 'entry' in data) {
        this.cohortDataService.sendCohortPaginationData(data);
        this.formatPatientData(data);
      } else {
        this.cohortDataService.sendCohortPaginationData(null);
        this.patientList = [];
        this.dataSource = new MatTableDataSource<any>(this.patientList);

      }
    }, error => {
      this.cohortDataService.sendCohortPaginationData(null);
      this.patientList = [];
      this.dataSource = new MatTableDataSource<any>(this.patientList);
    });
  }

  ngOnDestroy() {
    this.patientSearchSubscribe.unsubscribe();
    this.patientPaginationSubscribe.unsubscribe();
    this.cohortquerySubscription.unsubscribe();
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      familyName: [''],
      givenName: [''],
      gender: [''],
      birthDate: ['']
    });

    if (this.isFromPage && this.isFromPage === 'patinetPage') {
      this.searchPatients();
    }
  }

  clearDate() {
    this.searchForm.get('birthDate').setValue(null);
  }

  paginationAPIcall(URLparam) {
    this.showingDetailsFor = undefined;
    if (this.isFromPage === 'patinetPage') {
      this.patientViewService.paginationPatientData(URLparam).subscribe(data => {
        if (data && 'entry' in data) {
          this.cohortDataService.sendCohortPaginationData(data);
          this.formatPatientData(data);
        }
      });
    } else {
      if (this.queryParam) {
        this.queryParam['saveQuery'] = false;
      }
      this.cohortqueryService.queryExecutePagination(this.queryParam, URLparam).subscribe(data => {
        if (data && 'entry' in data) {
          this.cohortDataService.sendCohortPaginationData(data);
          this.formatPatientData(data);
        }
      });
    }

  }

  searchPatients() {
    this.showingDetailsFor = undefined;
    let param = {};

    if (this.searchForm.value.birthDate) {
      param['birthdate'] = this.dataPipe.transform(this.searchForm.value.birthDate, 'yyyy-MM-dd');
    }
    if (this.searchForm.value.givenName) {
      param['given'] = this.searchForm.value.givenName;
    }
    if (this.searchForm.value.gender) {
      param['gender'] = this.searchForm.value.gender.toLowerCase();
    }
    if (this.searchForm.value.familyName) {
      param['family'] = this.searchForm.value.familyName;
    }

    param['_format'] = 'json';
    param['search-offset'] = 0;
    param['_count'] = 10;

    this.patientViewService.searchPatientData(param).subscribe(data => {
      if (data && 'entry' in data) {
        this.cohortDataService.sendCohortPaginationData(data);
        this.formatPatientData(data);
      } else {
        this.patientList = data.entry;
        this.dataSource = new MatTableDataSource<any>(this.patientList);
      }
    });
  }

  calculateAge(birthday) {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  formatPatientData(patientData) {
    this.patientDataService.sendPatientCountList(patientData);
    for (let item of patientData.entry) {
      this.temporganizationRef = [];
      item['IXID'] = item.resource.id;
      item['Interopxid'] = this.getExtentionData(item.resource, 'interopxId-extension');
      item['Gender'] = 'gender' in item.resource ? item.resource.gender : '--';
      item['GivenName'] = this.getGivenName(item.resource);
      item['FamilyName'] = this.getFamilyName(item.resource);
      item['BirthDate'] = 'birthDate' in item.resource ? item.resource.birthDate : '--';
      item['Age'] = 'birthDate' in item.resource ? this.calculateAge(new Date(item.resource.birthDate)) : '--';
      item['Address'] = this.getAddress(item.resource);
      item['Practitioner'] = this.getPractitioner(item.resource);
      item['PractitionerRole'] = this.getPractitionerRole(item.resource);
      item['Organization'] = this.getorganization(item.resource);
      item['Identifier'] = item.resource.identifier;
      item['Alive'] = 'active' in item.resource ? item.resource.active : '--';
      item['Deceased'] = item.resource;
      item['Language'] = this.getLanguage(item.resource);
      item['Telecom'] = 'telecom' in item.resource ? item.resource.telecom : [];
      item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.dataPipe.transform(item.resource.meta.lastUpdated, 'yyyy-MM-dd hh:mm:ss a') : '--';
      item['BirthSex'] = this.getExtentionData(item.resource, 'us-core-birthsex');
      item['Race'] = this.getExtentionData(item.resource, 'us-core-race');
      item['Ethnicity'] = this.getExtentionData(item.resource, 'us-core-ethnicity');
      item['MothersMaidenName'] = this.getExtentionData(item.resource, 'mothersMaidenName');
    }

    this.patientList = patientData.entry;
    this.dataSource = new MatTableDataSource<any>(this.patientList);
    this.dataSource.data = this.patientList;
    this.dataSource.sort = this.Sort;
  }

  getExtentionData(extension: any, forType: any) {
    let tempSex = {
      'M': "Male",
      'F': "Female",
      'O': 'Other'
    };
    if ('extension' in extension) {
      for (let extitem of extension.extension) {
        if ('url' in extitem && extitem.url && extitem.url.includes(forType)) {
          if (forType === 'us-core-birthsex') {
            return extitem.valueCode;
          }
          if (forType === 'mothersMaidenName') {
            return extitem.valueString;
          }
          if (forType === 'interopxId-extension') {
            return extitem.valueString;
          }
          if (forType === 'us-core-ethnicity' || forType === 'us-core-race') {
            if ('extension' in extitem && extitem.extension instanceof Array) {
              let tcode = [];
              for (let item of extitem.extension) {
                if ('valueCoding' in item) {
                  tcode.push((item.valueCoding.display + ' | ') + '' + (item.valueCoding.code));
                }
              }
              return tcode;
            }
          }
        }
      }
    }

  }

  getLanguage(language: any) {
    let resLanguage = [];
    if ('communication' in language && language.communication instanceof Array) {
      for (let comm of language.communication) {
        if ('language' in comm && 'coding' in comm.language && comm.language.coding instanceof Array) {
          for (let lang of comm.language.coding) {
            resLanguage.push(lang);
          }
        }
      }
    }
    return resLanguage;
  }

  getOrganization(organization: any) {
    return 'managingOrganization' in organization ? [organization.managingOrganization] : [];
  }

  getPractitionerRole(practitionerRole: any) {
    let tempPractitionerRoleRef = [];
    if ('generalPractitioner' in practitionerRole) {
      if (practitionerRole.generalPractitioner instanceof Array) {
        for (let item of practitionerRole.generalPractitioner) {
          if ('reference' in item && item.reference) {
            let tempReference = item.reference;
            if (tempReference.toLowerCase().includes('practitionerrole')) {
              tempPractitionerRoleRef.push(item);
            }
          }
        }
      }
    }
    return tempPractitionerRoleRef;
  }

  getPractitioner(practitioner: any) {
    let tempPractitionerRef = [];
    if ('generalPractitioner' in practitioner) {
      if (practitioner.generalPractitioner instanceof Array) {
        for (let item of practitioner.generalPractitioner) {
          if ('reference' in item && item.reference) {
            let tempReference = item.reference;
            if ((tempReference.toLowerCase().includes('practitioner')) && (!tempReference.toLowerCase().includes('practitionerrole'))) {
              tempPractitionerRef.push(item);
            }
          }
        }
      }
    }
    return tempPractitionerRef;
  }

  getorganization(organization: any) {
    if ('generalPractitioner' in organization) {
      if (organization.generalPractitioner instanceof Array) {
        for (let item of organization.generalPractitioner) {
          if ('reference' in item && item.reference) {
            let tempReference = item.reference;
            if ((tempReference.toLowerCase().includes('organization'))) {
              this.temporganizationRef.push(item);
            }
          }
        }
      }
    }
    if ('managingOrganization' in organization && 'reference' in organization.managingOrganization) {
      this.temporganizationRef.push(organization.managingOrganization);
    }
    return this.temporganizationRef;
  }

  getGivenName(name: any) {
    let resGivenName = [];
    if ('name' in name) {
      if (name.name instanceof Array) {
        for (let item of name.name) {
          let tempname = [];
          if ('prefix' in item) tempname.push(item.prefix.join(','));
          if ('given' in item) tempname.push(item.given.join(','));
          if ('suffix' in item) tempname.push(item.suffix.join(','));
          resGivenName.push(tempname);
        }
      }
    }
    return resGivenName;
  }

  getFamilyName(name: any) {
    let resfamilyName = [];
    if ('name' in name) {
      if (name.name instanceof Array) {
        for (let item of name.name) {
          let tempname = [];
          if ('family' in item) tempname.push(item.family);
          resfamilyName.push(tempname);
        }
      }
    }
    return resfamilyName;
  }

  getAddress(address: any) {
    let resAddress = [];
    if ('address' in address && address.address instanceof Array) {
      for (let item of address.address) {
        let tempAddress = [];
        if ('line' in item && item.line) {
          item.line.forEach(it => {
            tempAddress.push(it + ' , ');
          });
        }
        if ('city' in item) tempAddress.push(item.city + ' , ');
        if ('district' in item) tempAddress.push(item.district + ' , ');
        if ('state' in item) tempAddress.push(item.state + ' , ');
        if ('country' in item) tempAddress.push(item.country + ' , ');
        if ('postalCode' in item) tempAddress.push(item.postalCode);
        if ('type' in item) tempAddress.push(' | ' + item.type);
        if ('use' in item) tempAddress.push(' | ' + item.use);
        resAddress.push(tempAddress.join('  '));
      }
    }
    return resAddress.length > 0 ? resAddress.join('<hr>') : '--';
  }

  popoverOpened(event, element, column) {
    return this.expandedElement === element ? null : element;
    // this.dataServiceGeneral.passDataToService(element);
    if (column == 'Organization') {
      this.target['nativeElement'].style.top = event.clientY + 'px';
      this.target['nativeElement'].style.left = event.clientX + 'px';
      this.elementData = element;
    }

  }

  onShowElememt(element) {

  }

  expandedElement: any;
  baseResourcecElement: any;
  isShowBaseResource(element) {
    return this.baseResourcecElement === element;
  }

  selectedOrg: any;
  selectedItem: any;
  toggleBaseResources(element, column, item) {
    if (this.showingDetailsFor) {
      this.showingDetailsFor = null;
    }
    this.selectedOrg = column;
    this.selectedItem = item;
    this.baseResourcecElement = this.baseResourcecElement === element ? null : element;
  }

  toggleDetails(patient: any, column: any) {
    if (this.hiperLinkColumns.indexOf(column) === -1) {
      if (this.baseResourcecElement) {
        this.baseResourcecElement = null;
      }
      this.showingDetailsFor = this.showingDetailsFor === patient ? null : patient;
    }
  }


  isShowingDetailsFor(patient: any): boolean {
    return this.showingDetailsFor === patient;
  }

  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;
    }
  }

  executeCohortQuery(queryData) {
    this.searchPatients();
  }


  setDirection({ value }: MatSelectChange): void {
    this.Sort.sort({
      id: this.sort.active,
      start: value,
      disableClear: true,
    });
  }
}
