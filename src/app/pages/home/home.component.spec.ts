import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CapitalizeFirstPipe } from '../../pipes/capitalize-first.pipe';

import { HomeComponent } from './home.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { SessionService } from '../../services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material';

class SessionServiceMock {
	currentUser = {displayName: ''};

	// noinspection JSUnusedGlobalSymbols
	getServerUrl = () => '';
}

describe('HomeComponent', () => {
	const router = {navigate: jasmine.createSpy('navigate')};

	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				HomeComponent,
				HeaderComponent,
				MainComponent,
				FooterComponent,
				CapitalizeFirstPipe,
			],
			imports: [
				FormsModule,
				HttpClientModule,
				BrowserAnimationsModule,
				MatFormFieldModule,
				MatInputModule,
				MatCheckboxModule,
				MatToolbarModule,
				MatTableModule,
				MatSortModule,
			],
			providers: [
				{provide: SessionService, useClass: SessionServiceMock},
				{provide: Router, useValue: router}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
