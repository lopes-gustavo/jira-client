import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule	} from '@angular/material-moment-adapter';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LogoutPageComponent } from './pages/logout-page/logout-page.component';
import { FooterComponent } from './pages/home/footer/footer.component';
import { HeaderComponent } from './pages/home/header/header.component';
import { TableComponent } from './pages/home/main/table/table.component';
import { MainComponent } from './pages/home/main/main.component';
import { ErrorComponent } from './pages/login-page/error/error.component';
import { DisclaimerComponent } from './pages/disclaimer/disclaimer.component';
import { HomeComponent } from './pages/home/home.component';
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
		BrowserAnimationsModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatToolbarModule,
		MatTableModule,
		MatSortModule,
		MatDatepickerModule,
		MatMomentDateModule,
	],
	providers: [
		{provide: LOCALE_ID, useValue: 'pt-BR'}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
