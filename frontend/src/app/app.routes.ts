import { Routes } from '@angular/router';
import { WineListComponent } from './wine-list/wine-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TwoFactorSetupComponent } from './components/two-factor-setup/two-factor-setup.component';
import { Login2faComponent } from './components/login-2fa/login-2fa.component';
import { WineFormComponent } from './components/wine-form/wine-form.component';
// We should add an AuthGuard here in a real app
// import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: WineListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/2fa', component: Login2faComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'wines/new',
    component: WineFormComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'settings/security',
    component: TwoFactorSetupComponent,
    // canActivate: [AuthGuard]
  },
  // Redirect any other path to home
  { path: '**', redirectTo: '' }
];
