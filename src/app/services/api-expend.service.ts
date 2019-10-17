import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { delay, timeout, catchError } from 'rxjs/operators';
import {of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiExpendService {
  response:any;
  constructor(private http:HttpClient) { }
  readService(liveAdminCode, access_token){
    let promesa= new Promise((resolve)=>{
      let url = 'https://'+liveAdminCode+'.izytimecontrol.com/api/reader/GetReadersApp'
      let header = { 
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+access_token
        } 
      }
      return this.http.get(url, header).pipe(
        delay(1000),
        timeout(2500),
        catchError(
          error=>of(408)
          )
      ).subscribe(
       (response)=>{
         let requestDevices={
           status,
           response,
         }
         if((Object.keys(response).length != 0)==true){
           if(response==408){
            requestDevices.status='408';
            requestDevices.response=response;
           this.response=requestDevices;
           }else{
            requestDevices.status='200';
            requestDevices.response=response;
           this.response=requestDevices;
           }
         }else  if((Object.keys(response).length == 0)==true){
            requestDevices.status='404';
            requestDevices.response=response;
            this.response=requestDevices;
         }
         resolve(this.response);
     },(error:HttpErrorResponse)=>{
      for (const key in error) {
        switch(key){
          case 'status':
              if (error.hasOwnProperty(key)) {
                const element = error[key];
                if(element==0){
                  let badRequestDevices={
                    status,
                  }
                  badRequestDevices.status='0';
                  this.response=badRequestDevices;
                  resolve(this.response);
                }
              }  
          break;
        }
      }
     })
    });
    return promesa;
  }

  getBranchByUserResumeService(liveAdminCode,access_token){
    let promesa= new Promise((resolve)=>{
      let url = 'https://'+liveAdminCode+'.izytimecontrol.com/api/branchoffice/GetBranchByUserResume'
    let header = { 
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+access_token
      } 
    }
      return this.http.get(url+'?type='+0, header).pipe(
        timeout(2500),
        catchError(
          error=>of(408)
        )
      )
      .subscribe(
       (response)=>{
         let requestSucursales={
           status,
           response,
         }
         if((Object.keys(response).length != 0)==true){
          if(response==408){
            requestSucursales.status='408';
            requestSucursales.response=response;
           this.response=requestSucursales;
           }else{
             requestSucursales.status='200';
             requestSucursales.response=response;
             this.response=requestSucursales;
            }
         }else  if((Object.keys(response).length == 0)==true){
          requestSucursales.status='404';
          requestSucursales.response=response;
            this.response=requestSucursales;
         }
         resolve(this.response);

      
     },(error:HttpErrorResponse)=>{
      for (const key in error) {
        switch(key){
          case 'status':
              if (error.hasOwnProperty(key)) {
                const element = error[key];
                if(element==0){
                  let badRequestDevices={
                    status,
                  }
                  badRequestDevices.status='0';
                  this.response=badRequestDevices;
                  resolve(this.response);
                }
              }  
          break;
        }
        
      }
         
     })
    });
    return promesa;
  }

  assistanceViewAppService(liveAdminCode, access_token, newBranchLeftRight){
    let promesa= new Promise((resolve)=>{
    let url = 'https://'+liveAdminCode+'.izytimecontrol.com/api/report/AssistanceViewApp'
    let header = { 
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+access_token
      } 
    }
    return this.http.get(url+'?branchId='+newBranchLeftRight, header)
    .pipe(
      delay(450),
      timeout(2500),
      catchError(
        error => of(408)
        )
    )
    .subscribe((response)=>{
      let requestAssistence={
        status,
        response,
      }
      if((Object.keys(response).length != 0)==true && (Object.keys(response['events']['AVRules']).length != 0)==true){
        if(response==408){
          requestAssistence.status='408';
          requestAssistence.response=response;
         this.response=requestAssistence;
         }else{
          requestAssistence.status='200';
          requestAssistence.response=response;
          this.response=requestAssistence;
        }
      }else if((Object.keys(response).length != 0) || (Object.keys(response['events']['AVRules']).length == 0)){
        requestAssistence.status='404';
        requestAssistence.response=response;
         this.response=requestAssistence;
      }
      resolve(this.response);

    },(error:HttpErrorResponse)=>{
       for (const key in error) {
        switch(key){
          case 'status':
              if (error.hasOwnProperty(key)) {
                const element = error[key];
                if(element==0){
                  let badRequestAssistence={
                    status,
                  }
                  badRequestAssistence.status='0';
                  this.response=badRequestAssistence;
                  resolve(this.response);
                }
              }  
          break;
        }
        
      }
    })
  });
  return promesa;


  }

}
