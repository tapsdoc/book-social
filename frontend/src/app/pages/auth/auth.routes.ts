import { Routes } from '@angular/router';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

export const AUTH_ROUTES: Routes = [
	{ path: '', redirectTo: '/books', pathMatch: 'full' },
	{ path: 'activate-account', component: ActivateAccountComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'login', component: LoginComponent },
]