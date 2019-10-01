import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { FunctionsService } from '../../services/functions.service';
import { ApiExpendService } from 'src/app/services/api-expend.service';

@Component({
  selector: 'app-mydevices',
  templateUrl: './mydevices.page.html',
  styleUrls: ['./mydevices.page.scss'],
})
export class MydevicesPage implements OnInit {

  mydevices_list: string = 'assets/img/mydevices_list.png'

  adminLoginResDetail: string = 'adminLoginResDetail'
  
  data: Observable<any>
  loadingElement: any
  
  access_token: any
  liveAdminCode: any
  
  readersItems: any
  currentVal=2;
  constructor(
    private authService: AuthenticationService,
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
    private storage: Storage,
    private _functionAlert:FunctionsService,
    private _apiexpendService:ApiExpendService
  ) { }
  ngOnInit() {
    

    this.storage.get(this.adminLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
        this.access_token = val['access_token']
      }
    })
    this.storage.get('liveAdminCode').then((val) => {
      if(val != null && val != undefined) {
        this.liveAdminCode = val
        this.getReadersService()
      }
    })
  }
  getReadersService() {
    this._functionAlert.MessageToast('Cargando...', 'top',1000);
    this._apiexpendService.readService(this.liveAdminCode, this.access_token)
    .then((response) => {
      switch(response['status']){
        case '200':
            this.readersItems = response['response']
            this.data=this.readersItems;
          break;
         case '404':
          this._functionAlert.MessageToast('Informacion no Encontrada...', 'middle',1000);
          break;
        case '0':
          setTimeout(() => {
            this._functionAlert.requireAlert('Error de Servicio', 'De Acuerdo');
          }, 2000);
            this.logout()
          break;
      }
    })
  }
  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
    this.nativePageTransitions.fade(options)
    this.router.navigate(['members', 'dashboard'])
  }
  logout() {
    this.authService.logout()
  }  
  whatClassIsItParent(IsActiveArg) {
    if(IsActiveArg == true) {
      return 'ctm-card-back-device-white ctm-b-r-device-card-green'
    } else {
      return 'custom-card-back-icon-e ctm-b-r-device-card-red custom-white'
    }
  }
  whatClassIsItChild(IsActiveArg) {
    if(IsActiveArg == true) {
      return 'ctm-b-r-device-card-green'
    } else {
      return 'ctm-b-r-device-card-red'
    }
  }  
}
