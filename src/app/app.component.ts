import { Component } from '@angular/core';

import { Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { IntroductionService } from './services/introduction.service';
import { Storage } from '@ionic/storage';

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
    private router: Router,
    private nativePageTransitions: NativePageTransitions,
    private fcm:FCM,
    private storage: Storage,
    private localNotifications:LocalNotifications,
    private _tutorial:IntroductionService,
  ) {
    this.initializeApp();
  }
  initializeApp() {
     this.platform.ready().then(() => {
      this._tutorial.cargar_storage()
      .then(()=>{
        if(this._tutorial.introduccion.mostrar_tutorial){
          let options: NativeTransitionOptions = {
            duration: 800
          }
          this.nativePageTransitions.fade(options);
          this.router.navigate(['Introduction']);
        }else{
          let options: NativeTransitionOptions = {
            duration: 800
          }
          this.nativePageTransitions.fade(options);
          this.router.navigate(['login']);
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
        let options: NativeTransitionOptions = {
          duration: 800
        }
        this.nativePageTransitions.fade(options)
        this.router.navigate(['members', 'attendanceview'])
      } else {
        let selectedBranchData = {
          Id: parseInt(notification.id_sucursal),
          Name: notification.nom_sucursal
        }
        this.storage.set('selectedBranchDataLocal', selectedBranchData);
        this.localNotificationFcm(this.fcmTitle, this.fcmMessage);
      }
    });
    
      this.statusBar.styleDefault();
      this.splashScreen.hide();



      this.authService.authenticationState.subscribe(state => {
        if(state) {
          let options: NativeTransitionOptions = {
            duration: 800
          }
          this.nativePageTransitions.fade(options);          
          this.router.navigate(['members', 'dashboard']);
        } else {
          let options: NativeTransitionOptions = {
            duration: 800
          }
          this.nativePageTransitions.fade(options);
          this.router.navigate(['login']);
        }
      })

    });
  }
  gotoDetail(){
    let options: NativeTransitionOptions = {
      duration: 800
    }
    this.nativePageTransitions.fade(options)
    this.router.navigate(['members', 'attendanceview'])
  }
  localNotificationFcm(fcmTitle, fcmMessage) {
    this.localNotifications.schedule({
      title: fcmTitle,
      text: fcmMessage,
      vibrate:true,
      led: { color: '#FF00FF', on: 500, off: 500 },
      icon: this.logoUrl,
      foreground: true
    })
  }
}
