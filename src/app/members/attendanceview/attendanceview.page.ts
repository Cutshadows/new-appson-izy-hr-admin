import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions/ngx";
import { Router } from "@angular/router";

import { LoadingController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { FunctionsService } from "src/app/services/functions.service";
import { ApiExpendService } from "src/app/services/api-expend.service";

@Component({
  selector: "app-attendanceview",
  templateUrl: "./attendanceview.page.html",
  styleUrls: ["./attendanceview.page.scss"]
})
export class AttendanceviewPage implements OnInit {
  calendar_img: string = "assets/img/calendar_img.png";
  adminLoginResDetail: string = "adminLoginResDetail";
  loadingElement: any;
  access_token: any;
  liveAdminCode: any;
  assistanceViewAppItems: any;
  customCurrentHour: any;
  currentHoursMinutes: any;
  triangle: string = "assets/img/triangle.png";
  branchByUserResumeData: any;
  newBranchLeftRight: any;
  selectedBranchIndex: any;
  leftCount: any;
  rightCount: any;
  currentVal = 3;
  constructor(
    private authService: AuthenticationService,
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
    private storage: Storage,
    public loadingController: LoadingController,
    private _functionAlert: FunctionsService,
    private __apiexpendService: ApiExpendService
  ) {}
  ngOnInit() {
    this.storage.get(this.adminLoginResDetail).then(val => {
      if (val != null && val != undefined) {
        this.access_token = val["access_token"];
      }
    });
    this.storage.get("liveAdminCode").then(val => {
      if (val != null && val != undefined) {
        this.liveAdminCode = val;
      }
    });
    this.storage.get("branchByUserResumeLocal").then(val => {
      if (val != null && val != undefined) {
        this.branchByUserResumeData = val;
      }
    });
    this.storage.get("selectedBranchDataLocal").then(val => {
      if (val != null && val != undefined) {
        this.newBranchLeftRight = val;
        this.findedCurrentIndex(this.newBranchLeftRight.Id);
        this.assistanceViewAppService();
      }
    });
  }
  findedCurrentIndex(branchId) {
    this.selectedBranchIndex = this.functiontofindIndexByKeyValue(
      this.branchByUserResumeData,
      "Id",
      branchId
    );
    if (this.branchByUserResumeData.length == this.selectedBranchIndex + 1) {
      this.rightCount = false;
    } else {
      this.rightCount = true;
    }
    if (this.selectedBranchIndex == 0) {
      this.leftCount = false;
    } else {
      this.leftCount = true;
    }
  }
  attendanceViewService() {
    this.customCurrentHour = this.assistanceViewAppItems.events.CurrentHour;
    var d = new Date(this.customCurrentHour);
    this.currentHoursMinutes = d.getHours() + ":" + d.getMinutes();
  }
  leftAttendanceClick() {
    this.selectedBranchIndex = this.selectedBranchIndex - 1;
    this.newBranchLeftRight = this.branchByUserResumeData[
      this.selectedBranchIndex
    ];
    this.storage.set("selectedBranchDataLocal", this.newBranchLeftRight);
    this.findedCurrentIndex(this.newBranchLeftRight.Id);
    this.assistanceViewAppService();
  }
  rightAttendanceClick() {
    this.selectedBranchIndex = this.selectedBranchIndex + 1;
    this.newBranchLeftRight = this.branchByUserResumeData[
      this.selectedBranchIndex
    ];
    this.storage.set("selectedBranchDataLocal", this.newBranchLeftRight);
    this.findedCurrentIndex(this.newBranchLeftRight.Id);
    this.assistanceViewAppService();
  }
  functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }
  async assistanceViewAppService() {
    let loadingElementMessage = await this.loadingController.create({
      message: "Cargando Asistencia",
      spinner: "crescent",
      cssClass: "transparent"
    });
    loadingElementMessage.present();
    this.__apiexpendService
      .assistanceViewAppService(
        this.liveAdminCode,
        this.access_token,
        this.newBranchLeftRight.Id
      )
      .then(response => {
        switch (response["status"]) {
          case "200":
            loadingElementMessage.dismiss();
            this.assistanceViewAppItems = response["response"];
            this.storage.set(
              "dateToProcessLocal",
              this.assistanceViewAppItems.events.DateToProcess
            );
            this.customCurrentHour = this.assistanceViewAppItems.events.CurrentHour;
            var d = new Date(this.customCurrentHour);
            this.currentHoursMinutes = d.getHours() + ":" + d.getMinutes();
            break;
          case "404":
            loadingElementMessage.dismiss();
            this.assistanceViewAppItems = response["response"];
            this._functionAlert.MessageToast(
              "No tiene datos...",
              "bottom",
              1000
            );
            break;
          case "0":
            loadingElementMessage.dismiss();
            setTimeout(() => {
              this._functionAlert.requireAlert(
                "Error de Servicio",
                "De Acuerdo"
              );
            }, 2000);
            this.logout();
            break;
          case '408':
            loadingElementMessage.dismiss();
            setTimeout(() => {
              this._functionAlert.requireAlert(
                "Error, tiempo excedido",
                "De Acuerdo"
              );
            }, 2000);
            this.logout();
        break;
        }
      });
  }
  async oneSecondLoaderOn(avEmployeesData) {
    this.loadingElement = await this.loadingController.create({
      message: "Cargando Detalle...",
      spinner: "crescent",
      cssClass: "transparent"
    });
    this.loadingElement.present();
    setTimeout(() => {
      this.loadingElement.dismiss();
      this.attendancedetailGo(avEmployeesData);
    }, 1000);
  }
  attendancedetailGo(avEmployeesData) {
    this.storage.set("avEmployeesDataLocal", avEmployeesData);
    let options: NativeTransitionOptions = {
      duration: 800
    };
    this.nativePageTransitions.fade(options);
    this.router.navigate(["members", "attendancedetail"]);
  }
  selectbranchGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    };
    this.nativePageTransitions.fade(options);
    this.router.navigate(["members", "selectbranch"]);
  }
  logout() {
    this.authService.logout();
  }
}
