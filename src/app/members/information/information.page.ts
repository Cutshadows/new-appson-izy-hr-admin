import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {
  close: string = 'assets/img/close.png'
  info_gray: string = 'assets/img/info_gray.png'
  newBranchLeftRight: any
  avEmployeesDetail: any
  currentVal=3;
  constructor(
    private authService: AuthenticationService,
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
    private storage: Storage
  ) { }
  ngOnInit() {
    this.storage.get('selectedBranchDataLocal').then((val) => {
      if(val != null && val != undefined) {
        this.newBranchLeftRight = val
      }
    })
    this.storage.get('avEmployeeDetailLocal').then((val) => {
      if(val != null && val != undefined) {
        this.avEmployeesDetail = val                    
      }
    })    
  }
  attendancedetailGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
    this.nativePageTransitions.fade(options)
    this.router.navigate(['members', 'attendancedetail'])    
  }  
  logout() {
    this.authService.logout()
  }  

}
