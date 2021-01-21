import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable()

export class DatasourceService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService) { }

  getResourcecNames(): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-datasource/LinkDatasourceTransformationController/getResourceNames", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getTransformationData(name, DsID): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-datasource/LinkDatasourceTransformationController/getDocumentTypeDefinition?resourceName=" + name + '&datasourceId=' + DsID, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  createMapping(param) {
    return this.restService.post(this.baseUrl + "ix-datasource/LinkDatasourceTransformationController/createMapping?operation=create", param, false, false, false, false, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getSchemaJSONdata(id) {
    return this.restService.get(this.baseUrl + "ix-datasource/LinkDatasourceTransformationController/getDocumentTypeSchema?id=" + id, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getMappedData(id) {
    return this.restService.get(this.baseUrl + "ix-datasource/LinkDatasourceTransformationController/getAllMappings?datasourceId=" + id, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  updateMappedData(param) {
    return this.restService.post(this.baseUrl + "ix-datasource/LinkDatasourceTransformationController/createMapping?operation=update", param, false, false, false, false, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getAllConnectors() {
    return this.restService.get(this.baseUrl + "ix-datasource/datasource/getAllConnectors", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getdatasourcelist(param) {
    return this.restService.post(this.baseUrl + "ix-datasource/datasource/list", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getListofAllDatasources() {
    return this.restService.get(this.baseUrl + "ix-datasource/datasource/list", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  testconnection() {
    return this.restService.get(localStorage.getItem('testurl') + "/metadata?_format=json", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  deletepatientpanel(param) {
    return this.restService.delete(this.baseUrl + "ix-datasource/datasource/delete/patient-panel/" + param, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  testdbcon(param) {
    return this.restService.post(this.baseUrl + "ix-datasource/datasource/flatFileDBConnTest", param, null, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getdatasetlist(param) {
    return this.restService.post(this.baseUrl + "ix-datasets/dataset/list", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  createDatasets(param) {
    return this.restService.post(this.baseUrl + "ix-datasets/dataset/create/", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  editDatasetRow(param) {
    return this.restService.put(this.baseUrl + "ix-datasets/dataset/update/", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  startextraction(param) {
    return this.restService.post(this.baseUrl + "ix-extraction/extraction/extract?dataSetId=" + param, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getagentlist(param, isLoader) {
    return this.restService.post(this.baseUrl + "ix-agent-management/agentManagement/list", param, isLoader)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  agentexecution(id, cmd): Observable<any> {
    return this.restService.post(this.baseUrl + "ix-agent-management/agentManagement/execute?agentId=" + id + "&agentFunction=" + cmd, null, null, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  createDataSource(param): Observable<any> {
    return this.restService.post(this.baseUrl + "ix-datasource/datasource/create", param, null, null, true, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  updateDataSource(param): Observable<any> {
    return this.restService.put(this.baseUrl + "ix-datasource/datasource/update", param, null, null, true, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getconfigpairlist() {
    return this.restService.get(this.baseUrl + "ix-configuration/configurationRules/getDatasourceConfigDefaultValues/", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

}
