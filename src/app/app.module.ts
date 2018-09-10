import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';

import { AppComponent } from './app.component';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TableComponent } from './components/table/table.component';
import { MainComponent } from './components/main/main.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    CapitalizeFirstPipe,
    LoginPageComponent,
    FooterComponent,
    HeaderComponent,
    TableComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
		FormsModule,
  ],
  providers: [
		{ provide: LOCALE_ID, useValue: 'pt-BR' }
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
