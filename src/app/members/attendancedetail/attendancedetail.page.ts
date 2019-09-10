import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions/ngx";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ToastController } from "@ionic/angular";
import { FunctionsService } from "../../services/functions.service";
@Component({
  selector: "app-attendancedetail",
  templateUrl: "./attendancedetail.page.html",
  styleUrls: ["./attendancedetail.page.scss"]
})
export class AttendancedetailPage implements OnInit {
  info_white: string = "assets/img/info_white.png";
  done: string = "assets/img/done.png";
  close: string = "assets/img/close.png";
  minus: string = "assets/img/minus.png";
  triangle: string = "assets/img/triangle.png";
  assistanceViewAppLocal: string = "assistanceViewAppLocal";
  assistanceViewAppItems: any;
  newBranchLeftRight: any;
  avEmployeesData: any;
  dateToProcessData: any;
  currentVal = 3;
  constructor(
    private authService: AuthenticationService,
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
    private storage: Storage,
    public toastController: ToastController,
    private _functionAlert: FunctionsService
  ) {}
  async ngOnInit() {
    this.storage.get("dateToProcessLocal").then(val => {
      if (val != null && val != undefined) {
        this.dateToProcessData = val;
      }
    });
    let loadingElementMessage = await this.toastController.create({
      message: "Desplegando Informacion",
      position: "top",
      cssClass: "my-custom-toast"
    });
    loadingElementMessage.present();
    this.storage.get("avEmployeesDataLocal").then(val => {
      if (val != null && val != undefined) {
        setTimeout(() => {
          this.avEmployeesData = val;
        }, 2000);
        if (this.avEmployeesData.length == 0) {
          this.noDataToast();
        }
      }
    });
    setTimeout(() => {
      loadingElementMessage.dismiss();
    }, 1000);

    this.storage.get("selectedBranchDataLocal").then(val => {
      if (val != null && val != undefined) {
        this.newBranchLeftRight = val;
      }
    });
  }
  informationGo(avEmployeesDetail) {
    this.storage.set("avEmployeeDetailLocal", avEmployeesDetail);
    let options: NativeTransitionOptions = {
      duration: 800
    };
    this.nativePageTransitions.fade(options);
    this.router.navigate(["members", "information"]);
  }
  async noDataToast() {
    this._functionAlert.MessageToast("Datos no encontrados", "middle", 2000);
  }
  attendanceviewGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    };
    this.nativePageTransitions.fade(options);
    this.router.navigate(["members", "attendanceview"]);
  }
  logout() {
    this.authService.logout();
  }
}
