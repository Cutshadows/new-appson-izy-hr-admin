import { Component } from '@angular/core';

import { Platform, NavController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { IntroductionService } from './services/introduction.service';
import { Storage } from '@ionic/storage';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  fcmMessage;
  logoUrl: string = 'assets/img/logo.png'
  fcmTitle;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private fcm:FCM,
    public nvCTRL:NavController,
    private storage: Storage,
    private localNotifications:LocalNotifications,
    private _tutorial:IntroductionService,
    private fingerprint:FingerprintAIO
  ) {
    this.initializeApp();
  }
  initializeApp() {
     this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this._tutorial.cargar_storage()
      .then(()=>{
        if(this._tutorial.introduccion.mostrar_tutorial){
          this.nvCTRL.navigateRoot(['Introduction']);
        }else{
          this.nvCTRL.navigateRoot(['login']);
        }
      });
    this.localNotifications.on('click').subscribe(res => {
      this.gotoDetail();
    })
    this.localNotifications.on('trigger').subscribe(res => {
    })

    this.fcm.onNotification().subscribe((notification) => {
      this.fcmTitle = notification.title;
      this.fcmMessage = notification.body;
      if(notification.wasTapped) {
        let selectedBranchData = {
          Id: parseInt(notification.id_sucursal),
          Name: notification.nom_sucursal
        }

        this.storage.set('selectedBranchDataLocal', selectedBranchData);
        this.nvCTRL.navigateRoot(['members', 'attendanceview']);
        
      } else {
        let selectedBranchData = {
          Id: parseInt(notification.id_sucursal),
          Name: notification.nom_sucursal
        }
        this.storage.set('selectedBranchDataLocal', selectedBranchData);
        this.localNotificationFcm(this.fcmTitle, this.fcmMessage);
      }
    });
      this.authService.authenticationState.subscribe(state => {
        if(state) {
          this.nvCTRL.navigateRoot(['members', 'dashboard']);
        } else {
          this.nvCTRL.navigateRoot(['login']);
        }
      })
      
    });
  }
  gotoDetail(){
    this.nvCTRL.navigateRoot(['members', 'attendanceview']);

  }
   localNotificationFcm(fcmTitle, fcmMessage) {
     this.localNotifications.schedule({
       title: fcmTitle,
       text: fcmMessage,
       vibrate:true,
       led: { color: '#FF00FF', on: 500, off: 500 },
       icon: this.logoUrl,
       foreground: true,
     })
   }
}
