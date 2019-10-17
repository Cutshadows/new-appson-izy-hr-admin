import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  response:any;
  header: any = { 
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers':'*'
    } 
  }
    constructor(private http:HttpClient){ }
    authLogin(adminCode, adminMail, adminPassword, fcmToken){
      let promesa= new Promise((resolve)=>{
        var url = 'https://'+adminCode+'.izytimecontrol.com/token';
      let params = 'grant_type=password&username='+adminMail+'&password='+adminPassword+'&fcmToken='+fcmToken
       this.http.post(url, params, this.header).pipe(
         timeout(3500),
         catchError(
           error=>of(408)
         )
       ).subscribe(
         (response)=>{
          let jsonResponse={
            status,
            response,
          }
          if(response){
            if(response==408){
              jsonResponse.status='408';
              jsonResponse.response=response;
              this.response=jsonResponse;
              resolve(this.response);
            }else{
              jsonResponse.status='200';
              jsonResponse.response=response;
              this.response=jsonResponse;
              resolve(this.response);
            }
          }
       },(error:HttpErrorResponse)=>{
        for (const key in error) {
          switch(key){
            case 'error':
                if (error.hasOwnProperty(key)) {
                  const element = error[key];
                  let jsonResponseError={
                    status,
                    response:JSON,
                  }
                  jsonResponseError.status="400";
                  jsonResponseError.response=element;
                  this.response=jsonResponseError;
                  resolve(this.response);
                  
                }
             break;
             case 'status':
                if (error.hasOwnProperty(key)) {
                  const element = error[key];
                  if(element==0){
                    let jsonResponseError={
                      status
                    }
                    jsonResponseError.status="0";
                    this.response=jsonResponseError;
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

    ReloginAuth(liveAdminCode,access_token){
      let promesaCarga= new Promise((resolve)=>{
        let url = 'https://'+liveAdminCode+'.izytimecontrol.com/api/userrole/GetUserRoleLogged';
    
        let header = { 
          'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+access_token
          } 
        }
        this.http.get(url,header).pipe(
          timeout(3500),
          catchError(error=>of(408)
          )
        ).subscribe((response)=>{
          let jsonResponse={
            status,
            response,
          }
          if(response){
            if(response==408){
              jsonResponse.status='408';
              jsonResponse.response=response;
              this.response=jsonResponse;
              resolve(this.response);
            }else{
              jsonResponse.status='200';
            jsonResponse.response=response;
            this.response=jsonResponse;
            resolve(this.response);
            }
          }
        },(error:HttpErrorResponse)=>{
          let jsonResponse={
            status,
          }
            jsonResponse.status='401';
            this.response=jsonResponse;
            resolve(this.response);
        });
      })
      return promesaCarga;
      
      
    
    }


}
