import { Routes } from '@angular/router';
import { WineListComponent } from './features/wine-list/wine-list.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { AccountSettingsComponent } from './features/account-settings/account-settings.component';
import { Login2faComponent } from './features/login-2fa/login-2fa.component';
import { WineFormComponent } from './features/wine-form/wine-form.component';
import { LabelUploadComponent } from './features/label-upload/label-upload.component';
import { WineDetailComponent } from './features/wine-detail/wine-detail.component';
import { NearbyWineriesComponent } from './features/nearby-wineries/nearby-wineries.component';
import { UserManagementComponent } from './features/user-management/user-management.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

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
