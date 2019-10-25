import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';

import { LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FunctionsService } from '../../services/functions.service';
import { ApiExpendService } from 'src/app/services/api-expend.service';


@Component({
  selector: 'app-selectbranch',
  templateUrl: './selectbranch.page.html',
  styleUrls: ['./selectbranch.page.scss'],
})
export class SelectbranchPage implements OnInit {
  adminLoginResDetail: string = 'adminLoginResDetail'
  loadingElement: any  
  access_token: any
  liveAdminCode: any  
  branchByUserResumeItems: any
  branchItem: any
  branchIdNameArray: any
  currentVal=2;
  constructor(
    private authService: AuthenticationService,
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
    private storage: Storage,
    public loadingController: LoadingController,
    private _functionAlert:FunctionsService,
    private __apiexpendService:ApiExpendService,
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
        this.getBranchByUserResumeService()
      }
    })
    
  }
  async getBranchByUserResumeService() {
    let loadingElementMessage = await this.loadingController.create({
      message: 'Cargando Sucursales',
      spinner: 'crescent',
      cssClass: 'transparent',
    });
    loadingElementMessage.present();
    this.__apiexpendService.getBranchByUserResumeService(this.liveAdminCode, this.access_token)
    .then((response) => {
      switch(response['status']){
        case '200':
            loadingElementMessage.dismiss();
            this.branchByUserResumeItems = response['response'];
            this.storage.set('branchByUserResumeLocal', this.branchByUserResumeItems);
          break;
        case '404':
            loadingElementMessage.dismiss();
            this._functionAlert.requireAlert('Datos no encontrados','De acuerdo');
          break;
          case '408':
            loadingElementMessage.dismiss();
            this._functionAlert.requireAlert('Problemas de conexion para cargar la data.','De acuerdo');
            setTimeout(()=>{
              this.dashboardGo();
            },2000);
          break;
        case '0':
            loadingElementMessage.dismiss();
            this._functionAlert.requireAlert('Error de servicio','De acuerdo');
            this.logout()
          break;
      }
    })    
  }
  attendanceviewGo() {    
    if(this.branchItem) {
      this.branchIdNameArray = this.branchItem.split("-")
      let selectedBranchData = {
        Id: parseInt(this.branchIdNameArray[0]),
        Name: this.branchIdNameArray[1]
      }
      this.storage.set('selectedBranchDataLocal', selectedBranchData)
      let options: NativeTransitionOptions = {
        duration: 800
      }
      this.nativePageTransitions.fade(options)
      this.router.navigate(['members', 'attendanceview'])
    }
  }  
  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
    this.nativePageTransitions.fade(options)
    this.router.navigate(['members', 'dashboard']);
  }
  logout() {
    this.authService.logout()
  }  
}
