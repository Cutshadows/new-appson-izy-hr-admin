import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

import { FunctionsService } from '../../services/functions.service';
import { AuthLoginService } from 'src/app/services/auth-login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  logoUrl: string = 'assets/img/logo.png'
  header: any = { 
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    } 
  }
  
  adminMail: string
  adminPassword: number
  adminCode: string
  codeLowerCase: any
  
  adminLoginResDetail: string = 'adminLoginResDetail'

  data: Observable<any>
  loadingElement: any

  fcmToken:any;

  scheduled = []

  fcmTitle: any
  fcmMessage: any  

  constructor(
    private authService: AuthenticationService,
    public http: HttpClient,
    public alertController: AlertController,
    private storage: Storage,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private _functionAlert:FunctionsService,
    private _authLogin:AuthLoginService  
  ) {
    this.cargarStorage().then((tokenD)=>{
      this.fcmToken=String(tokenD);
    });
  }
    

  ngOnInit() {
    this.storage.get(this.adminLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
        this.adminMail = val['userName'];
        
      }
    });
    
  }
  cargarStorage(){
    let promesa=new Promise((resolve)=>{
      this.storage.ready().then(()=>{
        this.storage.get('deviceFcmToken')
        .then(token=>{
          resolve(token);
        });
      });
    })
    return promesa;
  }

  async adminLogin() {
    if(this.adminCode != undefined && this.adminCode != '') {
      this.codeLowerCase = this.adminCode.toLowerCase()
    }   
    if(this.adminMail == undefined || this.adminMail == '') {
      this.requireAlert()   
    } else if(this.adminPassword == undefined) {
      this.requireAlert()
    } else if(this.adminCode == undefined ||this.adminCode == '') {
      this.requireAlert()
    }
    else {      
     
      let loadingElementMessage = await this.loadingController.create({
        message: 'Verificando Usuario',
        spinner: 'crescent',
        cssClass: 'transparent',
      });
      loadingElementMessage.present();

      this._authLogin.authLogin(this.adminCode, this.adminMail,this.adminPassword,this.fcmToken)
      .then((response) => {
       switch(response['status']){
         case '200':
            var responseData = response['response']
            setTimeout(() => {
              loadingElementMessage.dismiss()
            }, 500)
              if(responseData['access_token']) {
                this.storage.set(this.adminLoginResDetail, responseData)
                this.storage.set('adminCode', this.codeLowerCase)          
                this.storage.set('liveAdminCode', this.codeLowerCase)
                this.authService.login()
                this.resetInput()
            }
           break;
         case '400':
              setTimeout(() => {
                loadingElementMessage.dismiss()
              }, 500)
              var responseData = response['response']
              setTimeout(() => {
                this._functionAlert.requireAlert(responseData['error_description'], 'De Acuerdo');
              }, 600)
              this.resetInput()

           break;
         case '0':
            setTimeout(() => {
              loadingElementMessage.dismiss()
            }, 500)
            var responseData = response['response']
            setTimeout(() => {
              this._functionAlert.requireAlert('Error de Conexion', 'De Acuerdo');
            }, 600)
           break;

       }
      })
    }
  }  

  resetInput() {
    this.adminPassword = undefined
    this.adminCode = undefined
  }
  
  requireAlert() {
    this._functionAlert.requireAlert('Por favor llena todos los espacios','De acuerdo');
  }  

  passwordValid() {
    this._functionAlert.MessageToast('La contraseña debe ser número','top',2000);
  }
  async wrongInputAlert(resMessage) {
    const alert = await this.alertController.create({
      message: resMessage,
      buttons: ['De acuerdo']
    });

    await alert.present()
  }
  
  badRequestAlert() {
    this._functionAlert.requireAlert('Error de servicio','De acuerdo');
  }  

  clearStorage() {
    this.storage.clear().then(() => {
    })    
  }
}
