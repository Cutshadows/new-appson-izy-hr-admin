import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'selectbranch', loadChildren: './selectbranch/selectbranch.module#SelectbranchPageModule' },
  { path: 'attendanceview', loadChildren: './attendanceview/attendanceview.module#AttendanceviewPageModule' },
  { path: 'attendancedetail', loadChildren: './attendancedetail/attendancedetail.module#AttendancedetailPageModule' },
  { path: 'information', loadChildren: './information/information.module#InformationPageModule' },
  { path: 'mydevices', loadChildren: './mydevices/mydevices.module#MydevicesPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
