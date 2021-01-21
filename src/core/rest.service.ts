import { throwError as observableThrowError, Observable, TimeoutError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError, timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from './loader/loader.service';
import Swal from 'sweetalert2';

// import { AuthenticationService } from 'src/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public headers: HttpHeaders;
  public options: {};
  public disableLoader: boolean = false;
  public blobOutput: boolean = false;

  public isFhireAPI: boolean = false;

  constructor(private http: HttpClient,
    private loaderService: LoaderService,) {
    this.headers = new HttpHeaders({

      // 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN')
    })
  }

  public get(url: string, param: {}, disableLoader?: boolean, token?: string, user?: boolean, isPatient?: boolean): Observable<any> {
    this.disableLoader = disableLoader;
    if (!this.disableLoader) {
      this.loaderService.show();
    }
    if (user && token) {

    }

    // TODO check out the usage of HTTPParams
    let queryParams: string = '';
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        queryParams += `${key}=${param[key]}&`;
      }
    }
    queryParams = queryParams.slice(0, -1);
    const paramz = new HttpParams({
      fromString: queryParams
    });

    if (isPatient) {
      this.isFhireAPI = true;
      this.headers = new HttpHeaders({
        'Authorization': 'Bearer 290c002337428c4f00b3ec4ddf962a16',
        'Cache-Control': 'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    } else {
      this.headers = new HttpHeaders({
        // 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN')
        ...(localStorage.getItem('X-AUTH-TOKEN') && { 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN') }),
        'Cache-Control': 'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }

    this.options = {
      headers: this.headers,
      params: paramz,
      responseType: 'json',
      withCredentials: true
    };

    return this.http
      .get(url, this.options).pipe(
        timeout(60000),
        map((data: any) =>
          this.handleResponse(data, this)),
        catchError((error: any) => {
          this.handleError(error, this);
          return observableThrowError(error);
        }));
  }

  public post(url: string, param: {}, disableLoader?: boolean, token?: boolean, upload?: boolean, blobOutput?: boolean, response?: string): Observable<any> {
    let responseType = 'json';
    this.disableLoader = disableLoader;

    this.blobOutput = blobOutput;

    let body = param;
    if (upload) {
      // Other header params are not accepted in upload (server)
      this.headers = new HttpHeaders({
        enctype: 'multipart/form-data',
        ...(localStorage.getItem('X-AUTH-TOKEN') && { 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN') })
        // 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN')
      });
    } else {
      if (response == 'response') {
        this.headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
      } else {
        this.headers = new HttpHeaders({
          'Content-Type': 'application/json',
          ...(localStorage.getItem('X-AUTH-TOKEN') && { 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN') })
          //'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN')
        });
      }

      body = JSON.stringify(param);
    }

    if (!disableLoader) {
      this.loaderService.show();
    }
    if (this.blobOutput) {
      responseType = 'blob';
    }
    if (response == 'text') {
      responseType = 'text'
    }

    this.options = {
      headers: this.headers,
      responseType,
      withCredentials: true,
    };

    if (response == 'response') {
      this.options['observe'] = 'response'
    }


    return this.http.post(url, body, this.options).pipe(
      timeout(60000),
      map((data: any) =>
        this.handleResponse(data, this)),
      catchError((error: any) => {
        this.handleError(error, this);
        return observableThrowError(error);
      }));
  }


  public put(url: string, param: {}, disableLoader?: boolean, token?: boolean, upload?: boolean, response?: any): Observable<any> {

    this.disableLoader = disableLoader;
    let body = param;
    this.blobOutput = false;
    if (upload) {
      // Other header params are not accepted in upload (server)
      this.headers = new HttpHeaders({
        enctype: 'multipart/form-data',
        // 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN')
        ...(localStorage.getItem('X-AUTH-TOKEN') && { 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN') })
      });
    } else {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        ...(localStorage.getItem('X-AUTH-TOKEN') && { 'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN') })
        //'X-AUTH-TOKEN': localStorage.getItem('X-AUTH-TOKEN')
      });
      body = JSON.stringify(param);
    }

    if (!disableLoader) {
      this.loaderService.show();
    }

    this.options = {
      headers: this.headers,
      withCredentials: true
    };

    if (response == 'text') {
      this.options['responseType'] = 'text'
    }

    return this.http.put(url, body, this.options).pipe(
      timeout(60000),
      map((data: any) =>
        this.handleResponse(data, this)),
      catchError((error: any) => {
        this.handleError(error, this);
        return observableThrowError(error);
      }));
  }

  public delete(url: string, param: {}, isUrlPAram?: boolean, disableLoader?: boolean): Observable<any> {
    this.disableLoader = disableLoader;

    if (!this.disableLoader) {
      this.loaderService.show();
    }

    let queryParams: string = '';
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        queryParams += `${key}=${param[key]}&`;
      }
    }
    queryParams = queryParams.slice(0, -1);

    this.options = {
      headers: this.headers,
      params: isUrlPAram ? queryParams : param,
      withCredentials: true
    };

    return this.http
      .delete(url, this.options).pipe(
        timeout(60000),
        map((data: any) =>
          this.handleResponse(data, this)),
        catchError((error: any) => {
          this.handleError(error, this);
          return observableThrowError(error);
        }));

  }


  private handleResponse(res: Response, that) {
    that.loaderService.hide();
    let body: any = res;
    if (typeof res == 'string') {
      let response = {
        message: body
      }
      body = response;
      this.loaderService.showNotificationMsg(body.message, 'success', 'success');
    }

    return body || {};
  }

  private handleError(operation, result) {

    if (operation instanceof TimeoutError) {
      this.loaderService.showNotificationMsg(operation.message, 'error', operation.name);
      this.loaderService.hide();
      return;
    }
    if (operation instanceof TypeError) {
      this.loaderService.showNotificationMsg("Something went wrong Please try later", 'error', 'Error');
      this.loaderService.hide();
      return;
    }
    this.loaderService.hide();
    if ('status' in operation) {
      if (operation.status == '401') {
        this.loaderService.showNotificationMsg(operation.error.message, 'error', operation.error.error);
        return;
      }

      // if((operation.status == '404') && (operation.error !== 'Record(s) not available!')) {
      //   this.loaderService.showNotificationMsg('Page not found', 'error', operation.status);
      //   return;
      // }

      if (this.isFhireAPI && operation.status == 500 && operation.error instanceof Object) {
        return;
      }
      this.loaderService.showNotificationMsg(operation.error.includes('!doctype html') ? 'Something went wrong' : operation.error, 'error', operation.status);
    }
    return (error: any) => {
      if (operation === 'createDatasourceError') {
        this.loaderService.showNotificationMsg(error.status, 'error');
        // this.util.notify('Error in creating Data Source', 'error', error.status);
        return result;
      } else if (operation === 'getListofAlldatasources') {
        this.loaderService.hide();
        // this.isLoadingResults = false;
        // this.loading.next(this.isLoadingResults);
        if (error.status === 0) {
          this.loaderService.showNotificationMsg('User doesnt have access to DataSources', 'error');
          // this.util.notify('User doesnt have access to DataSources', 'error', 'error');
          return result;
        }
        if (error.status === 403) {
          Swal.fire({
            type: 'error',
            title: 'User doesnt have access to DataSources',
            text: 'Contact Administrator',
            // footer: '<a href>Why do I have this issue?</a>'
          })
          this.loaderService.showNotificationMsg('User doesnt have access to DataSources', 'error');
          // this.util.notify('User doesnt have access to DataSources', 'error', 'error');
          return result;
        }
        // else if (error.status === 403) {
        Swal.fire({
          title: 'Session Expired',
          text: "You Need to Login Again",
          type: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Logout'
        }).then((result) => {
          if (result.value) {
            // this.authService.logOut();
          }
        })
        return result;
      } else if (operation === 'deletedatasource') {
        if (error.status === 0) {
          this.loaderService.showNotificationMsg('This Data Source is linked to Data Set', 'error');
          // this.util.notify('This Data Source is linked to Data Set', 'info', 'Info');
          return result;
        }
        else {
          this.loaderService.showNotificationMsg('Error in deleting  Data Source', 'error');
          // this.util.notify('Error in deleting  Data Source', 'error', error.status);
          return result;
        }
      } else if (operation === 'updateDatasourceError') {
        this.loaderService.showNotificationMsg('Error in Updating   Data Source', 'error');
        // this.util.notify('Error in Updating   Data Source', 'error', error.status);
        return result;
      }
      else if (operation === 'deletepatientpanel') {
        this.loaderService.showNotificationMsg('Error in deleting Patient Panel', 'error');
        // this.util.notify('Error in deleting Patient Panel', 'error', error.status);
        return result;
      } else if (operation === 'getdsById') {
        this.loaderService.showNotificationMsg('Error in Getting the Data Source by Id', 'error');
        // this.util.notify('Error in Getting the Data Source by Id', 'error', error.status);
        return result;
      } else if (operation === 'getAllDatasourcesByDatasId') {
        this.loaderService.showNotificationMsg('Error in Getting the List of Patients By Data Source Id', 'error');
        // this.util.notify('Error in Getting the List of Patients By Data Source Id', 'error', error.status);
        return result;
      } else if (operation === 'connectionError') {
        this.loaderService.showNotificationMsg('Enter the Valid Endpoint Url', 'error');
        // this.util.notify('Enter the Valid Endpoint Url', 'error', error.status);
        return result;
      } else if (operation === 'createMapping') {

        this.loaderService.hide();
        // this.isLoadingResults = false;
        this.loaderService.showNotificationMsg('Error in creating mappings', 'error');
        // this.util.notify('Error in creating mappings', 'error', error.status);
        return result;
      } else if (operation === 'updateMapping') {
        this.loaderService.hide();
        // this.isLoadingResults = false;
        if (error.status === 500) {
          this.loaderService.showNotificationMsg('Error in Linking with datasource', 'error');
          // this.util.notify('Error in Linking with datasource', 'error', error.status);
          return result;
        }
      }

      else if (operation === 'getresourcenames') {
        this.loaderService.hide();
        // this.isLoadingResults = false;
        this.loaderService.showNotificationMsg('Error in getting resource names', 'error');
        // this.util.notify('Error in getting resource names', 'error', error.status);
        return result;
      }
      else if (operation === 'getschema') {
        this.loaderService.hide();
        // this.isLoadingResults = false;
        this.loaderService.showNotificationMsg('Error in getting schema', 'error');
        // this.util.notify('Error in getting schema', 'error', error.status);
        return result;
      }
      else if (operation === 'getmappings') {
        this.loaderService.hide();
        // this.isLoadingResults = false;
        this.loaderService.showNotificationMsg('Error in getting list of mappings', 'error');
        // this.util.notify('Error in getting list of mappings', 'error', error.status);
        return result;
      }
    };
  }


}
