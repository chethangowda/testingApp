import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DatasourceService } from 'src/services/datasourcec.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/core/loader/loader.service';
import { JsonSchemaDialogComponent } from '../json-schema-dialog/json-schema-dialog.component';

@Component({
  selector: 'app-transformation-maping',
  templateUrl: './transformation-maping.component.html',
  styleUrls: ['./transformation-maping.component.scss']
})
export class TransformationMapingComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Output() messageEvent = new EventEmitter<any>();
  @Input() onGetInput: any;
  @Input() isEdit: boolean;
  datasourceDetails: any;
  resourceNames: any = [];
  transformationData: any = [];
  resdataSource = new MatTableDataSource();
  resultTransformationData: any = [];
  srcform: FormGroup;
  tgtform: FormGroup;
  defform: FormGroup;
  isDisableBtn: boolean = true;
  displayedColumns = ['select', 'resource', 'sourcedocument', 'targetdocument', 'transformationdocument'];
  constructor(private datasourceService: DatasourceService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private matDialog: MatDialog) {


  }

  ngOnChanges() {
    this.getResourceNameList();
    this.datasourceDetails = this.onGetInput;
    if (this.datasourceDetails) {
    }
  }

  ngOnInit() {
  }

  getResourceNameList() {
    this.datasourceService.getResourcecNames().subscribe(data => {
      if (data) {
        for (let item of data) {
          this.resourceNames.push(item);
        }
      }
      this.getTransformationDetails(this.resourceNames);
    })
  }

  apiCount: any = 0;
  getTransformationDetails(resourceNames) {
    this.apiCount = 0;
    for (let res of resourceNames) {
      this.apiCount++;
      this.datasourceService.getTransformationData(res.resourceName, this.datasourceDetails.id).subscribe(data => {
        this.apiCount--;
        let transformationData = data;
        let sourceArray: any = [];
        let destinationArray: any = [];
        let targetArray: any = [];
        for (let k = 0; k < transformationData.source.length; k++) {
          const srcver = {
            source: transformationData.source[k].documentTypeDefinitionName + '-' + transformationData.source[k].documentTypeDefinitionVersion,
            srcid: transformationData.source[k].documentTypeId,
            srcversion: transformationData.source[k].documentTypeDefinitionVersion,
            srcdocid: transformationData.source[k].documentTypeDefinitionId
          }
          sourceArray.push(srcver);
        }

        for (let m = 0; m < transformationData.target.length; m++) {
          const tgtver = {
            target: transformationData.target[m].documentTypeDefinitionName + '-' + transformationData.target[m].documentTypeDefinitionVersion,
            tgtid: transformationData.target[m].documentTypeId,
            tgtversion: transformationData.target[m].documentTypeDefinitionVersion,
            tgtdocid: transformationData.target[m].documentTypeDefinitionId
          }
          targetArray.push(tgtver);
        }

        for (let l = 0; l < transformationData.transformation.length; l++) {
          const definitionver = {
            transformation: transformationData.transformation[l].documentTypeDefinitionName + '-' + transformationData.transformation[l].documentTypeDefinitionVersion,
            defid: transformationData.transformation[l].documentTypeId,
            defversion: transformationData.transformation[l].documentTypeDefinitionVersion,
            defdocid: transformationData.transformation[l].documentTypeDefinitionId
          }
          destinationArray.push(definitionver);
        }

        const resobject = {
          resource: transformationData.resourceName,
          source: 'Source' + '-' + transformationData.resourceName,
          sourceversion: sourceArray,
          target: 'Target' + '-' + transformationData.resourceName,
          targetversion: targetArray,
          transform: 'Transformation' + '-' + transformationData.resourceName,
          definitionversion: destinationArray,
          checkselect: true
        }
        this.transformationData.push(resobject);
        setTimeout(() => {
          this.resdataSource = new MatTableDataSource(this.transformationData);
          this.resdataSource.paginator = this.paginator;
        }, 100);

        if (this.apiCount == 0) {
          this.isDisableBtn = false;
          if (this.isEdit) {
            this.getMappedDetails(this.datasourceDetails.id);
          }
        }


      }, error => {
        this.isDisableBtn = false;
      })
    }
  }

  onPageChange(event) {
  }

  goback() {
    this.messageEvent.emit('back');
  }

  mappedResource: any = [];
  getMappedDetails(datasourceID) {
    this.datasourceService.getMappedData(datasourceID).subscribe(data => {
      this.mappedResource = data;
      for (let res of this.transformationData) {
        for (let mapData of this.mappedResource) {
          if (res.resource == mapData.resourceName) {
            res['mapedID'] = mapData.id;
            res['toDelete'] = mapData.toDelete;
            res['alreadySelected'] = true;
            for (let item of res.sourceversion) {
              if (item.srcid == mapData.sourceTransformationId && item.srcversion == mapData.sourceVersion) {
                res['selectedSourceVal'] = item;
                res.checked = true;
                res.checkselect = false;
              }
            }
            for (let item of res.targetversion) {
              if (item.tgtid == mapData.targetTransformationId && item.tgtversion == mapData.targetVersion) {
                res['selectedTargetVal'] = item;
                res.checked = true;
                res.checkselect = false;
              }
            }
            for (let item of res.definitionversion) {
              if (item.defid == mapData.transformationDefintionId && item.defversion == mapData.transformationVersion) {
                res['selectedTransformationVal'] = item;
                res.checked = true;
                res.checkselect = false;
              }
            }

          }
        }
      }

    })

  }

  sourceChanged(event, element) {
    this.checkAllTypeSelected(element);
  }

  targetChanged(event, element) {
    this.checkAllTypeSelected(element);
  }

  definitionChanged(event, element) {
    this.checkAllTypeSelected(element);
  }

  checkAllTypeSelected(element) {
    if (('selectedSourceVal' in element && element.selectedSourceVal) &&
      ('selectedTargetVal' in element && element.selectedTargetVal) &&
      ('selectedTransformationVal' in element && element.selectedTransformationVal)) {
      element.checkselect = false;
    }
  }

  selChange(event, element) {
    if ('checked' in element && !element.checked) {
      element.selectedSourceVal = null;
      element.selectedTargetVal = null;
      element.selectedTransformationVal = null;
      element.checkselect = true;
    }
  }

  getJSONSchema(element, itemType, value) {
    let jsonID = element[itemType][value]
    let jsonData;
    this.datasourceService.getSchemaJSONdata(jsonID).subscribe((response: any) => {
      jsonData = response;
      if (jsonData) {
        let jsonDialog = this.matDialog.open(JsonSchemaDialogComponent, {
          width: '95%',
          height: '93%',
          data: { jsonData }
        });
      }
    })
  }

  clear() {
    this.resultTransformationData = [];

    for (let res of this.transformationData) {

      if (('alreadySelected' in res && res.alreadySelected)) {
        let resObj = {
          id: res.mapedID,
          resourceName: res.resource,
          sourceTransformationId: res.selectedSourceVal.srcid,
          sourceVersion: res.selectedSourceVal.srcversion,
          targetTransformationId: res.selectedTargetVal.tgtid,
          targetVersion: res.selectedTargetVal.tgtversion,
          transformationDefintionId: res.selectedTransformationVal.defid,
          transformationVersion: res.selectedTransformationVal.defversion,
          sourceDocumentId: res.selectedSourceVal.srcdocid,
          targetDocumentId: res.selectedTargetVal.tgtdocid,
          transformationDocumentId: res.selectedTransformationVal.defdocid,
          toDelete: true
        }
        this.resultTransformationData.push(resObj);
      }
    }

    let resJson = {
      arrayJson: this.resultTransformationData,
      datasourceId: this.datasourceDetails.id
    }

    this.updateMappingAPIcall(resJson);
  }

  checkItemIsSelected() {
    let returnData = false;
    for (let item of this.transformationData) {
      if (item.checked) {
        return true;
      }
    }
    return returnData;
  }

  onsave() {
    if (!this.checkItemIsSelected()) {
      this.loaderService.showNotificationMsg('Please select mapping', 'info', 'Validation');
      return;
    }

    this.resultTransformationData = [];

    for (let res of this.transformationData) {
      if ('checked' in res && res.checked) {
        let resObj = {
          resourceName: res.resource,
          sourceTransformationId: res.selectedSourceVal.srcid,
          sourceVersion: res.selectedSourceVal.srcversion,
          targetTransformationId: res.selectedTargetVal.tgtid,
          targetVersion: res.selectedTargetVal.tgtversion,
          transformationDefintionId: res.selectedTransformationVal.defid,
          transformationVersion: res.selectedTransformationVal.defversion,
          sourceDocumentId: res.selectedSourceVal.srcdocid,
          targetDocumentId: res.selectedTargetVal.tgtdocid,
          transformationDocumentId: res.selectedTransformationVal.defdocid,
          toDelete: false
        }
        this.resultTransformationData.push(resObj);
      }
    }

    let resJson = {
      arrayJson: this.resultTransformationData,
      datasourceId: this.datasourceDetails.id
    }

    this.createMappingAPIcall(resJson);
  }

  update() {
    if (!this.checkItemIsSelected()) {
      this.loaderService.showNotificationMsg('Please select mapping', 'info', 'Validation');
      return;
    }

    this.resultTransformationData = [];

    for (let res of this.transformationData) {

      if ('checked' in res && res.checked) {
        let resObj = {
          id: res.mapedID,
          resourceName: res.resource,
          sourceTransformationId: res.selectedSourceVal.srcid,
          sourceVersion: res.selectedSourceVal.srcversion,
          targetTransformationId: res.selectedTargetVal.tgtid,
          targetVersion: res.selectedTargetVal.tgtversion,
          transformationDefintionId: res.selectedTransformationVal.defid,
          transformationVersion: res.selectedTransformationVal.defversion,
          sourceDocumentId: res.selectedSourceVal.srcdocid,
          targetDocumentId: res.selectedTargetVal.tgtdocid,
          transformationDocumentId: res.selectedTransformationVal.defdocid,
          toDelete: false
        }
        this.resultTransformationData.push(resObj);
      } else if (('alreadySelected' in res && res.alreadySelected) && !res.checked) {
        let resObj = {
          id: res.mapedID,
          toDelete: true
        }
        this.resultTransformationData.push(resObj);
      }
    }

    let resJson = {
      arrayJson: this.resultTransformationData,
      datasourceId: this.datasourceDetails.id
    }

    this.updateMappingAPIcall(resJson);
  }

  createMappingAPIcall(param) {
    this.datasourceService.createMapping(param).subscribe(data => {
      this.messageEvent.emit('save');
    }, error => {
      this.messageEvent.emit('save');
    })
  }

  updateMappingAPIcall(param) {
    this.datasourceService.updateMappedData(param).subscribe(data => {
      this.messageEvent.emit('save');
    }, error => {
      this.messageEvent.emit('save');
    })
  }

}
