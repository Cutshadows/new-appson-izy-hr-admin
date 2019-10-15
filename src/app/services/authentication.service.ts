import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

const TOKEN_KEY = 'auth-token';

const FINGER_KEY='auth-finger-credencials';
const FINGER_QUESTION='finger-question';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);
  fingerquestion={
    state:Boolean
  };

  constructor(
    private storage: Storage,
    private plt: Platform
  ) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  login() {
    return this.storage.set(TOKEN_KEY, 'IZYHR ADMIN-PXERTDDGFG').then(res => {
      this.authenticationState.next(true);
    });
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  checkToken() {
    return this.storage.get(TOKEN_KEY).then(res => {
      if(res) {
        this.authenticationState.next(true);
      }
    })
  }

  credencialFingerStorage(ArregloCredenciales){
    let promise= new Promise((resolve, reject)=>{
      //if(this.plt.is('cordova')){
        this.storage.set(FINGER_KEY, ArregloCredenciales);
        resolve();
      //}
    });
    return promise;
  }
  questionFingerStorage(ArregloRespuesta){
    let promise = new Promise((resolve, reject)=>{
      this.storage.set(FINGER_QUESTION, ArregloRespuesta);
      resolve();
    })
    return promise;
  }

}
