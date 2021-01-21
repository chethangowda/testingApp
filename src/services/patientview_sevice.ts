import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable()

export class PatientViewService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService) { }


  getAllPatientList(): Observable<any> {
    return this.restService.get(this.baseUrl + "InteropXFHIR/fhir/Patient", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  searchPatientData(param): Observable<any> {
    return this.restService.get(this.baseUrl + "InteropXFHIR/fhir/Patient", param, null, null, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  paginationPatientData(urlParam) {
    return this.restService.get(urlParam, null, null, null, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  patientResourcecData(resourcecName, param) {
    return this.restService.get(this.baseUrl + "InteropXFHIR/fhir/" + resourcecName, param, null, null, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  paginationPatientResourcecData(urlParam) {
    return this.restService.get(urlParam, null, null, null, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getLocationResource(reference) {
    return this.restService.get(this.baseUrl + "InteropXFHIR/fhir/" + reference, null, true, null, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getOrganizationDetails(reference) {
    return this.restService.get(this.baseUrl + "InteropXFHIR/fhir/" + reference, null, null, null, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

}
