import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DisclaimerComponent } from './pages/disclaimer/disclaimer.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { DisclaimerGuard } from './guards/disclaimer.guard';
import { LogoutPageComponent } from './pages/logout-page/logout-page.component';

const appRoutes: Routes = [
	{ path: 'disclaimer', component: DisclaimerComponent },
	{ path: 'login', component: LoginPageComponent, canActivate: [ DisclaimerGuard ] },
	{ path: 'logout', component: LogoutPageComponent },
	{ path: '', component: HomeComponent, pathMatch: 'full', canActivate: [ DisclaimerGuard, AuthGuard ] },
	{ path: '**', redirectTo: '/' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports: [
		RouterModule
	]
})
export class AppRouting { }
