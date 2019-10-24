import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

import { FCM } from '@ionic-native/fcm/ngx';
import { FunctionsService } from '../../services/functions.service';
import { AuthLoginService } from 'src/app/services/auth-login.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

const loginFinger='loginfingerCredencial';
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
  adminMail: string;
  adminPassword: number;
  adminCode: string;
  codeLowerCase: any;
  adminLoginResDetail: string = 'adminLoginResDetail';
  data: Observable<any>;
  loadingElement: any;
  fcmToken: any;
  scheduled = [];
  dataLogin=[];
  fcmTitle: any;
  fcmMessage: any;
  codeArray: any = [];
  addNewCodeButton: boolean = false;
  userPreviousCode:any;
  
  constructor(
    private authService: AuthenticationService,
    public http: HttpClient,
    public alertController: AlertController,
    private storage: Storage,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private fcm: FCM,
    private _functionAlert:FunctionsService,
    private _authLogin:AuthLoginService,
    private fingerPrint:FingerprintAIO,
    private plt:Platform  
  ) {}
  ngOnInit() {
    this.storage.get('userCode').then((val) => {
      if(val != null && val != undefined) {
        for(let j = 0; j < val.length; j++) {
          this.codeArray.push(val[j])
        }
      }      
    })
    this.storage.get('liveAdminCode').then((val) => {
      if(val != null && val != undefined) {
        this.userPreviousCode = val
      }            
    })
    this.storage.get(this.adminLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
        this.adminMail = val['userName'];
      }
    });
    this.getFcmToken();
  }
  getFcmToken() {
    this.fcm.getToken().then(token => {
      this.storage.set('deviceFcmToken', token)
      this.fcmToken = token;
    })
    this.fcm.onTokenRefresh().subscribe(token => {
      this.storage.set('deviceFcmToken', token)
      this.fcmToken = token
    })    
  }
  resetInput() {
    this.adminPassword = undefined
    this.adminCode = undefined
  }

  async loginWithSelectCode(){
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
                this.storage.set(this.adminLoginResDetail, responseData);
                this.storage.set('liveAdminCode', this.adminCode);
                this.authService.login();
                this.resetInput();
                loadingElementMessage.dismiss();
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
              loadingElementMessage.dismiss();
            }, 500)
            var responseData = response['response']
            setTimeout(() => {
              this._functionAlert.requireAlert('Error de Conexion', 'De Acuerdo');
            }, 600)
           break;
           case '408':
            setTimeout(() => {
              loadingElementMessage.dismiss();
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
  async loginWithCode(){
    if(this.adminCode != undefined && this.adminCode != '') {
      this.codeLowerCase = this.adminCode.toLowerCase()
    }
    var keepGoing = true
    if(this.codeArray.length > 0) {
      for(let k = 0; k <= this.codeArray.length; k++) {
        if(keepGoing) {
          if(this.codeLowerCase == this.codeArray[k]) {            
            keepGoing = false
          }
        }
      }
    }
    if(this.adminMail == undefined || this.adminMail == '') {
      this.requireAlert()   
    } else if(this.adminPassword == undefined) {
      this.requireAlert()
    }else if(keepGoing == false) {
        this.alreadyExistCodeAlert();
    } else if(this.adminCode == undefined ||this.adminCode == '') {
      this.requireAlert();
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
        console.log("respuesta de la red baja  "+response['status']);
       switch(response['status']){
         case '200':
            var responseData = response['response']
            setTimeout(() => {
              loadingElementMessage.dismiss()
            }, 500)
              if(responseData['access_token']) {
                this.dataLogin.push({"email":this.adminMail , "password":this.adminPassword, "code":this.adminCode});
                this.storage.set(loginFinger, this.dataLogin);
                this.storage.set(this.adminLoginResDetail, responseData);
                this.codeArray.push(this.codeLowerCase);
                this.storage.set('adminCode', this.codeLowerCase);          
                this.storage.set('liveAdminCode', this.codeLowerCase);
                this.storage.set('userCode', this.codeArray);       
                this.authService.login();
                this.resetInput();
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
              loadingElementMessage.dismiss();
            }, 500)
            var responseData = response['response']
            setTimeout(() => {
              this._functionAlert.requireAlert('Error de Conexion', 'De Acuerdo');
            }, 600)
           break;
           case '408':
            setTimeout(() => {
              loadingElementMessage.dismiss();
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
  ionViewWillEnter(){
    this.storage.keys().then((keyStorage)=>{
      for (let index = 0; index < keyStorage.length; index++) {
        const element = keyStorage[index];
        if(element=='userCode'){
          this.storage.get('userCode').then((datauserCode)=>{
            if(datauserCode.length==1){
              this.storage.get(loginFinger).then((dataLoginFinger)=>{
                if(dataLoginFinger!=null){
                  this.loginWithPreviousCode();
                }
              });
            }
          });
        }
      }
    });
}
async loginWithPreviousCode(){
  let emailUserFinger, passwordUserFinger, codeUserFinger;
  this.storage.get(loginFinger).then((val) => {
    emailUserFinger=val[0].email;
    passwordUserFinger=val[0].password;
    codeUserFinger=val[0].code;
  });
  if(this.plt.is('cordova')){
    this.fingerPrint.isAvailable().then(typeAuth=>{
      switch(typeAuth){
        case 'finger':
            this.fingerPrint.show({
              clientId: 'android.izyhradmin.com',
              localizedFallbackTitle: 'Usar Pin',
              clientSecret:'#1a23w45e67r8tAAA', 
              localizedReason: 'Para continuar, auntentificar con huella' 
            }).then( async (resultFingerAuth:any)=>{
              if(resultFingerAuth=='Success'){
                let loadingElementMessage = await this.loadingController.create({
                      message: 'Verificando Usuario',
                      spinner: 'crescent',
                      cssClass: 'transparent',
                    });
                    loadingElementMessage.present();
                    this._authLogin.authLogin(codeUserFinger, emailUserFinger,passwordUserFinger,this.fcmToken)
                    .then((response) => {
                     switch(response['status']){
                       case '200':
                          var responseData = response['response']
                            if(responseData['access_token']) {
                                this.storage.set(this.adminLoginResDetail, responseData);
                                this.authService.login();
                                this.resetInput();
                                loadingElementMessage.dismiss();
                            }
                         break;
                       case '400':
                            setTimeout(() => {
                              loadingElementMessage.dismiss();
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
                         case '408':
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
            }).catch((error:any)=>{
              this._functionAlert.MessageToast('Autentificacion no valida, intente mas tarde', 'top', 2000);
              this.resetInput();
            });
          break;
          case 'face':
            this.fingerPrint.show({
              clientId: 'android.izyhradmin.com',
              localizedFallbackTitle: 'Usar Pin',
              clientSecret:'#1a23w45e67r8tAAA', 
              localizedReason: 'Para continuar, auntentificar con reconocimiento facial'
            }).then( async (resultFingerAuth:any)=>{
              if(resultFingerAuth=='Success'){
                let loadingElementMessage = await this.loadingController.create({
                  message: 'Verificando Usuario',
                  spinner: 'crescent',
                  cssClass: 'transparent',
                });
                loadingElementMessage.present();
                this._authLogin.authLogin(codeUserFinger, emailUserFinger,passwordUserFinger,this.fcmToken)
                .then((response) => {
                 switch(response['status']){
                   case '200':
                      var responseData = response['response']
                        if(responseData['access_token']) {
                            this.storage.set(this.adminLoginResDetail, responseData);
                            this.authService.login();
                            this.resetInput();
                            loadingElementMessage.dismiss();
                        }
                     break;
                   case '400':
                        setTimeout(() => {
                          loadingElementMessage.dismiss();
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
                     case '408':
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
            }).catch((error:any)=>{
              this._functionAlert.MessageToast('Autentificacion no valida, intente mas tarde', 'top', 2000);
              this.resetInput();
            });
          break;
      }
}).catch(async (error:any)=>{
  for (const key in error) {
    if (error.hasOwnProperty(key)) {
      const element = error[key];
      if(element=="Biometry is not available in passcode lockout" || element==8){
         this._functionAlert.requireAlert("Identificación incorrecta", 'De acuerdo');
      }else if(element=='No identities are enrolled.'|| element==7){
            const alert=await this.alertController.create({
              header:'Sin huella',
              message:'¿Desea continuar <strong>sin registrar metodo de autentificación</strong>?',
              cssClass:'classAlert',
              buttons:[
                {
                  text:'SI',
                  cssClass:'cssAlert',
                  handler:async() => {
                    if(this.adminMail == undefined || this.adminMail == '') {
                        this.requireAlert()   
                      } else if(this.adminPassword == undefined) {
                        this.requireAlert()
                      }
                      else {
                        let loadingElementMessage = await this.loadingController.create({
                              message: 'Verificando Usuario',
                              spinner: 'crescent',
                              cssClass: 'transparent',
                            });
                            loadingElementMessage.present();
                            this._authLogin.authLogin(this.userPreviousCode, this.adminMail,this.adminPassword,this.fcmToken)
                            .then((response) => {
                            switch(response['status']){
                              case '200':
                                  var responseData = response['response']
                                            if(responseData['access_token']) {
                                                this.storage.set(this.adminLoginResDetail, responseData);
                                                this.authService.login();
                                                this.resetInput();
                                                loadingElementMessage.dismiss();
                                            }
                                         break;
                                         case '400':
                                              setTimeout(() => {
                                                loadingElementMessage.dismiss();
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
                                          case '408':
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
                },{
                  text:'NO',
                  cssClass:'cssAlert',
                  handler:()=>{
                    this.resetInput();
                  }
                }
              ]
            });
            await alert.present();
      }
    }
  }
})
}
}
  // async loginWithPreviousCode(){
  //   if(this.adminMail == undefined || this.adminMail == '') {
  //     this.requireAlert()   
  //   } else if(this.adminPassword == undefined) {
  //     this.requireAlert()
  //   }
  //   else {
  //     let loadingElementMessage = await this.loadingController.create({
  //       message: 'Verificando Usuario',
  //       spinner: 'crescent',
  //       cssClass: 'transparent',
  //     });
  //     loadingElementMessage.present();
  //     this._authLogin.authLogin(this.userPreviousCode, this.adminMail,this.adminPassword,this.fcmToken)
  //     .then((response) => {
  //      switch(response['status']){
  //        case '200':
  //           var responseData = response['response']
  //             if(responseData['access_token']) {
  //               this.storage.set(this.adminLoginResDetail, responseData);
  //               this.authService.login();
  //               this.resetInput();
  //               loadingElementMessage.dismiss();
  //           }
  //          break;
  //        case '400':
  //             setTimeout(() => {
  //               loadingElementMessage.dismiss();
  //             }, 500)
  //             var responseData = response['response']
  //             setTimeout(() => {
  //               this._functionAlert.requireAlert(responseData['error_description'], 'De Acuerdo');
  //             }, 600)
  //             this.resetInput()

  //          break;
  //        case '0':
  //           setTimeout(() => {
  //             loadingElementMessage.dismiss();
  //           }, 500)
  //           var responseData = response['response']
  //           setTimeout(() => {
  //             this._functionAlert.requireAlert('Error de Conexion', 'De Acuerdo');
  //           }, 600)
  //          break;
  //          case '408':
  //           setTimeout(() => {
  //             loadingElementMessage.dismiss();
  //           }, 500)
  //           var responseData = response['response']
  //           setTimeout(() => {
  //             this._functionAlert.requireAlert('Error de Conexion', 'De Acuerdo');
  //           }, 600)
  //          break;

  //      }
  //     });
  //   }
  // }
  addNewCodeHideShow(){
    this.addNewCodeButton = !this.addNewCodeButton
    this.adminPassword = undefined
    this.adminCode = undefined
  }
  
  requireAlert() {
    this._functionAlert.requireAlert('Por favor llena todos los espacios','De acuerdo');
  }  
  alreadyExistCodeAlert() {
    this._functionAlert.requireAlert('El código ya existe','De acuerdo');
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
