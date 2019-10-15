import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';

import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';

import { HttpClientModule } from '@angular/common/http';

import { HTTP } from '@ionic-native/http/ngx';

import { FCM } from '@ionic-native/fcm/ngx';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FunctionsService } from './services/functions.service';
import { AuthLoginService } from './services/auth-login.service';
import { IntroductionService } from './services/introduction.service';

import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FunctionsService,
    AuthLoginService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativePageTransitions,
    HTTP,
    FCM,
    LocalNotifications,
    IntroductionService,
    FingerprintAIO
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}