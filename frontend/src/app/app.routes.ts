import { Routes } from '@angular/router';
import { WineListComponent } from './wine-list/wine-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { Login2faComponent } from './components/login-2fa/login-2fa.component';
import { WineFormComponent } from './components/wine-form/wine-form.component';
import { LabelUploadComponent } from './components/label-upload/label-upload.component';
import { WineDetailComponent } from './components/wine-detail/wine-detail.component';
import { NearbyWineriesComponent } from './components/nearby-wineries/nearby-wineries.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { adminGuard } from './admin.guard';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: WineListComponent },
  {
    path: 'wines/upload',
    component: LabelUploadComponent,
    canActivate: [authGuard]
  },
  {
    path: 'wines/new',
    component: WineFormComponent,
    canActivate: [authGuard]
  },
  { path: 'wines/:id', component: WineDetailComponent },
  { path: 'nearby-wineries', component: NearbyWineriesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/2fa', component: Login2faComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'wines/:id/edit',
    component: WineFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings/account',
    component: AccountSettingsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/users',
    component: UserManagementComponent,
    canActivate: [adminGuard]
  },
  // Redirect any other path to home
  { path: '**', redirectTo: '' }
];
