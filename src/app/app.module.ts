import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { LogoutPageComponent } from './components/logout-page/logout-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TableComponent } from './components/table/table.component';
import { MainComponent } from './components/main/main.component';
import { ErrorComponent } from './components/login-page/error/error.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { HomeComponent } from './components/home/home.component';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';

registerLocaleData(localePt);

@NgModule({
	declarations: [
		AppComponent,
		CapitalizeFirstPipe,
		LoginPageComponent,
		LogoutPageComponent,
		FooterComponent,
		HeaderComponent,
		TableComponent,
		MainComponent,
		ErrorComponent,
		DisclaimerComponent,
		HomeComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRouting,
		HttpClientModule,
	],
	providers: [
		{provide: LOCALE_ID, useValue: 'pt-BR'}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
