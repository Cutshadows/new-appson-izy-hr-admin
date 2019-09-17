import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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
      console.log("Token de FCM por el lado del auth services"+fcmToken)
      let promesa= new Promise((resolve)=>{
        var url = 'https://'+adminCode+'.izytimecontrol.com/token';
      let params = 'grant_type=password&username='+adminMail+'&password='+adminPassword+'&fcmToken='+fcmToken
       this.http.post(url, params, this.header).subscribe(
         (response)=>{
          let jsonResponse={
            status,
            response,
          }
          if(response){
            jsonResponse.status='200';
            jsonResponse.response=response;
            this.response=jsonResponse;
            resolve(this.response);
           
          }
       },(error)=>{
         console.log("Error -- "+error);
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
      let promesaCarga= new Promise((resolve, reject)=>{
        let url = 'https://'+liveAdminCode+'.izytimecontrol.com/api/userrole/GetUserRoleLogged';
    
        let header = { 
          'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+access_token
          } 
        }
        this.http.get(url,header).subscribe((response)=>{
          let jsonResponse={
            status,
            response,
          }
          if(response){
            jsonResponse.status='200';
            jsonResponse.response=response;
            this.response=jsonResponse;
            resolve(this.response);
          }
        },()=>{
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
