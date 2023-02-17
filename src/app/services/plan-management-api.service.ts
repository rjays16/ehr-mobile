import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, timeout, tap} from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class PlanManagementApiService {
  private url = 'http://localhost:3000';
  private getAllOrdersPath = '/api/doctor/planmanagement/getAllOrders';
  private postFinalizeRequrestOrdersPath = '/api/doctor/planmanagement/finalize/orders';
  private postMedicineSearchPath = '/api/doctor/medicine/search';
  private postPrescriptionSavePath = '/api/doctor/prescription/save';
  private getPrescriptionPrintFilePath = '/api/doctor/patient/prescription/file/path';
  private postCoursewardSavePath = '/api/doctor/courseward/save';
  private postCoursewardDeletePath = '/api/doctor/courseward/delete';
  private postReferralSavePath = '/api/doctor/referral/save';
  private postReferralDeletePath = '/api/doctor/referral/delete';
  private postDiagnosticLaboratorySavePath = '/api/doctor/diagnostic/lab/save';
  private getDiagnosticLaboratoryConfigPath = '/api/doctor/diagnostic/lab/configanddef';
  private postDiagnosticLaboratoryDeletePath = '/api/doctor/diagnostic/lab/delete';
  private postDiagnosticRadiologySavePath = '/api/doctor/diagnostic/rad/save';
  private getDiagnosticRadiologyConfigPath = '/api/doctor/diagnostic/rad/configanddef';
  private postDiagnosticRadiologyDeletePath = '/api/doctor/diagnostic/rad/delete';
  private postRepetitiveDeletePath = '/api/doctor/repetitive/delete';
  private postRepetitiveSavePath = '/api/doctor/repetitive/save';
  private postFinalizedRepetitiveDeletePath = '/api/doctor/finalized/repetitive/delete';

  private token: string;
  constructor(private platform: Platform,
              private httpClient: HttpClient,
              private http: HTTP) {

  }

  public setUrl(url: string) {
    this.url = url;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public finalizeRequestOrders(encounter_no: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      return from(this.http.post(this.url + this.postFinalizeRequrestOrdersPath + '?encounterNo=' + encounter_no, {}, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Plan management all orders: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Plan management all orders error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postFinalizeRequrestOrdersPath, {}, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public getAllOrders(encounter_no: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      return from(this.http.post(this.url + this.getAllOrdersPath + '?encounterNo=' + encounter_no, {}, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Plan management all orders: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Plan management all orders error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.getAllOrdersPath, {}, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public searchMedicine(query: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      return from(this.http.post(this.url + this.postMedicineSearchPath + '?q=' + query, {}, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Plan management all orders: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Plan management all orders error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const params = new HttpParams()
        .set('q', query);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postMedicineSearchPath, {}, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public savePrescription(encounter_no: string, prescription_list: any[]): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const params = {
        orders: prescription_list
      };
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      };
      this.http.setDataSerializer('json');
      return from(this.http.post(this.url + this.postPrescriptionSavePath + '?encounterNo=' + encounter_no, params, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Save prescriptions: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Save prescriptions error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = {
        orders: prescription_list
      };
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postPrescriptionSavePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public saveCourseward(courseward: any): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      const data = {};
      Object.keys(courseward).forEach(key => {
        if (key !== 'encounter_no') {
          data[key] = courseward[key];
        }
      });

      const body = {
        data
      };
      console.log('body: ', body);

      this.http.setDataSerializer('json');
      return from(this.http.post(this.url + this.postCoursewardSavePath + '?encounterNo=' + courseward.encounter_no, body, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Plan management all orders: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Plan management all orders error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const data = {};
      Object.keys(courseward).forEach(key => {
        if (key !== 'encounter_no') {
          data[key] = courseward[key];
        }
      });
      const body = {
        data
      };
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', courseward.encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postCoursewardSavePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public deleteCourseward(encounter_no: string, id: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      const body = {
        'data[id]': id
      };
      console.log('body: ', body);
      // tslint:disable-next-line: max-line-length
      return from(this.http.post(this.url + this.postCoursewardDeletePath + '?encounterNo=' + encounter_no + '&orders=' + id, {}, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Plan management all orders: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Plan management all orders error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = new FormData();
      body.append('data[id]', id);
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no)
        .set('orders', id);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postCoursewardDeletePath, {}, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public saveReferral(referral: any): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      const data = {};
      Object.keys(referral).forEach(key => {
        if (key !== 'encounter_no') {
          data[key] = referral[key];
        }
      });

      const body = {
        data
      };
      console.log('body: ', body);
      this.http.setDataSerializer('json');
      return from(this.http.post(this.url + this.postReferralSavePath + '?encounterNo=' + referral.encounter_no, body, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Plan management all orders: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Plan management all orders error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const data = {};
      Object.keys(referral).forEach(key => {
        if (key !== 'encounter_no') {
          data[key] = referral[key];
        }
      });

      const body = {
        data
      };
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', referral.encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postReferralSavePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public deleteReferral(encounter_no: string, id: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      const body = {
        'data': {
          'id': id
        } 
      };
      this.http.setDataSerializer('json');
      console.log('body: ', body);
      return from(this.http.post(this.url + this.postReferralDeletePath + '?encounterNo=' + encounter_no, body, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Plan management all orders: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Plan management all orders error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = new FormData();
      body.append('data[id]', id);

      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postReferralDeletePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public saveDiagnosticLaboratory(encounter_no: string, orders: any): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const params = {
        orders
      };
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      this.http.setDataSerializer('json');
      return from(this.http.post(this.url + this.postDiagnosticLaboratorySavePath + '?encounterNo=' + encounter_no, params, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Save prescriptions: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Save prescriptions error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = {
        orders
      };
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postDiagnosticLaboratorySavePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public getDiagnosticLaboratoryConfig(encounter): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      const params = {
        encounterNo: encounter
      };

      return from(this.http.get(this.url + this.getDiagnosticLaboratoryConfigPath, params, headers)).pipe(
        map((response: any) => {
          const configAndDefaults = JSON.parse(response.data);
          console.log('Config and Defaults: ', configAndDefaults);
          return configAndDefaults;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              // do nothing
            }
          }
          console.log('Config n Defaults error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const params = new HttpParams()
        .set('encounterNo', encounter);

      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      return this.httpClient.get(this.url + this.getDiagnosticLaboratoryConfigPath, httpOptions).pipe(
        map((response: any) => {
          console.log('Config and Defaults:', response);
          return response;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log('Config and Defaults error: ', err, caught);
          return throwError(err);
        })
      );
    }
  }

  public getDiagnosticRadiologyConfig(encounter): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      const params = {
        encounterNo: encounter
      };

      return from(this.http.get(this.url + this.getDiagnosticRadiologyConfigPath, params, headers)).pipe(
        map((response: any) => {
          const configAndDefaults = JSON.parse(response.data);
          console.log('Config and Defaults: ', configAndDefaults);
          return configAndDefaults;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              // do nothing
            }
          }
          console.log('Config n Defaults error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const params = new HttpParams()
        .set('encounterNo', encounter);

      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      return this.httpClient.get(this.url + this.getDiagnosticRadiologyConfigPath, httpOptions).pipe(
        map((response: any) => {
          console.log('Config and Defaults:', response);
          return response;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log('Config and Defaults error: ', err, caught);
          return throwError(err);
        })
      );
    }
  }

  public deleteDiagnosticLaboratory(encounter_no: string, id: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const body = {
        data: {id:id}
      };
      console.log('body: ', body);
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      // tslint:disable-next-line: max-line-length
      this.http.setDataSerializer('json');
      return from(this.http.post(this.url + this.postDiagnosticLaboratoryDeletePath + '?encounterNo=' + encounter_no, body, headers)).pipe(
        // timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Save prescriptions: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Save prescriptions error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = new FormData();
      body.append('data[id]', id);
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postDiagnosticLaboratoryDeletePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public saveDiagnosticRadiology(encounter_no: string, orders: any): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const params = {
        orders
      };
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      this.http.setDataSerializer('json');
      return from(this.http.post(this.url + this.postDiagnosticRadiologySavePath + '?encounterNo=' + encounter_no, params, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Save prescriptions: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Save prescriptions error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = {
        orders
      };
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postDiagnosticRadiologySavePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public deleteDiagnosticRadiology(encounter_no: string, id: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const body = {
        data: {id:id}
      };
      console.log('body: ', body);
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      // tslint:disable-next-line: max-line-length
      this.http.setDataSerializer('json');
      return from(this.http.post(this.url + this.postDiagnosticRadiologyDeletePath + '?encounterNo=' + encounter_no, body, headers)).pipe(
        // timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Save prescriptions: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Save prescriptions error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = new FormData();
      body.append('data[id]', id);
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postDiagnosticRadiologyDeletePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  } 

  public saveRepetitive(encounter_no: string, repetitiveData: any): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      const data = {};
      Object.keys(repetitiveData).forEach(key => {
        data[key] = repetitiveData[key];
      });

      const body = {
        data
      };

      console.log('body: ', body);

      this.http.setDataSerializer('json');
      // tslint:disable-next-line: max-line-length
      return from(this.http.post(this.url + this.postRepetitiveSavePath + '?encounterNo=' + encounter_no, body, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const data = {};
      Object.keys(repetitiveData).forEach(key => {
        data[key] = repetitiveData[key];
      });
      const body = {
        data
      };
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postRepetitiveSavePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public deleteRepetitive(encounter_no: string, id: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const body = {
        'data': id
      };
      console.log('body: ', body);
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      // tslint:disable-next-line: max-line-length
      return from(this.http.post(this.url + this.postRepetitiveDeletePath + '?encounterNo=' + encounter_no, body, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = new FormData();
      body.append('data', id);
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postRepetitiveDeletePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public deleteFinalizedRepetitive(encounter_no: string, id: string, encounterCourseWardID: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      const body = {
        'data': id,
        'encounterCourseWardID' : encounterCourseWardID
      };
      console.log('body: ', body);
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      // tslint:disable-next-line: max-line-length
      return from(this.http.post(this.url + this.postFinalizedRepetitiveDeletePath + '?encounterNo=' + encounter_no, body, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      const body = new FormData();
      body.append('data', id);
      body.append('encounterCourseWardID', encounterCourseWardID);
      console.log('body: ', body);
      const params = new HttpParams()
        .set('encounterNo', encounter_no);
      console.log('params: ', params);
      const httpOptions = {
        params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.post(this.url + this.postFinalizedRepetitiveDeletePath, body, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

  public getPrescriptionPrintFile(encounter_no: string, prescriptions: any): Observable<any>  {
    console.error("prescriptions",prescriptions);
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('native');
      let params: any = {
        encounter_no,
        is_group: '1',
      };
      Object.keys(prescriptions).forEach(key => {
        params[key] = prescriptions[key];
      });
      console.log('params: ', params);
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      };

      console.log('headers: ', headers);
      return from(this.http.get(this.url + this.getPrescriptionPrintFilePath, params, headers)).pipe(
        timeout(30000),
        map((response: any) => {
          const responseData = JSON.parse(response.data);
          console.log('Prescription Print File: ', responseData);
          return responseData;
        }),
        catchError((err: any, caught: Observable<any>) => {
          if (typeof err.error === 'string') {
            try {
              err.error = JSON.parse(err.error);
            } catch (e) {
              console.log('err.error parse failed: ', e);
            }
          }
          console.log('Prescription Print File error: ', err, caught);
          return throwError(err);
        })
      );
    } else {
      console.log('browser');
      let params ='';
      params = 'encounter_no='+encounter_no+"&is_group="+1;
        // .set('encounterNo', encounter_no)
        // .set('is_group', '1')
        ;
      // prescriptions['encounterNo'] = encounter_no;
      // prescriptions['is_group'] = 1;
      Object.keys(prescriptions).forEach(key => {
        params += '&'+key+"="+prescriptions[key]
      });
      console.log('params: ', params);
      const httpOptions = {
        // params: Object.entries(prescriptions).reduce(
        //   (params, [key, value]) => params.set(key, value), new HttpParams()),
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
        })
      };
      console.log('httpOptions', httpOptions);
      return this.httpClient.get(this.url + this.getPrescriptionPrintFilePath+"?"+params, httpOptions).pipe(
        timeout(30000),
        map((results: any) => {
          console.log(results);
          return results;
        }),
        catchError((err: any, caught: Observable<any>) => {
          console.log(caught);
          console.error(err);
          return throwError(err);
        })
      );
    }
  }

}
