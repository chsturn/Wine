import { Routes } from '@angular/router';
import { WineListComponent } from './wine-list/wine-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', component: WineListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Redirect any other path to home
  { path: '**', redirectTo: '' }
];
