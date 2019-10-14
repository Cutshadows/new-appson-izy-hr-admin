import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions/ngx";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { LoadingController } from "@ionic/angular";
import { FunctionsService } from "../../services/functions.service";
import { AuthLoginService } from "src/app/services/auth-login.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage implements OnInit {
  attendance_view: string = "assets/img/attendance_view.png";
  mydevices_view: string = "assets/img/mydevices_view.png";
  logoUrl: string = "assets/img/logo.png";
  adminLoginResDetail: string = "adminLoginResDetail";
  adminInfoItems: any;
  loadingElement: any;
  access_token: any;
  liveAdminCode: any;
  userRoleLoggedItem: any;
  fcmToken: any;
  firebaseTestResponse: any;
  scheduled = [];
  currentVal = 1;
  constructor(
    private authService: AuthenticationService,
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
    private storage: Storage,
    public loadingController: LoadingController,
    private _functionAlert: FunctionsService,
    private _authLogin: AuthLoginService
  ) {}
  ngOnInit() {
    this.storage.get(this.adminLoginResDetail).then(val => {
      if (val != null && val != undefined) {
        this.adminInfoItems = val;
      }
    });
    this.storage.get(this.adminLoginResDetail).then(val => {
      if (val != null && val != undefined) {
        this.access_token = val["access_token"];
      }
    });
    this.storage.get("liveAdminCode").then(val => {
      if (val != null && val != undefined) {
        this.liveAdminCode = val;
        this.getUserRoleLoggedService();
      }
    });
  }
  async getUserRoleLoggedService() {
    let loadingElementMessage = await this.loadingController.create({
      message: "Verificando Usuario",
      spinner: "crescent",
      cssClass: "transparent"
    });
    loadingElementMessage.present();
    this._authLogin
      .ReloginAuth(this.liveAdminCode, this.access_token)
      .then(response => {
        switch (response["status"]) {
          case "200":
            loadingElementMessage.dismiss();
            this.userRoleLoggedItem = response["response"];
            break;
          case "401":
            loadingElementMessage.dismiss();
            this._functionAlert.requireAlert(
              "Error, Sesion Expiro",
              "De acuerdo"
            );
            this.logout();
            break;
          case "408":
                loadingElementMessage.dismiss();
                this._functionAlert.requireAlert(
                  "Error, Sesion Expiro",
                  "De acuerdo"
                );
                this.logout();
          break;
        }
      });
  }
  mydevicesGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    };
    this.nativePageTransitions.fade(options);
    this.router.navigate(["members", "mydevices"]);
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
