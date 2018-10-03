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

describe('HomeComponent', () => {
	const router = {navigate: jasmine.createSpy('navigate')};
	const sessionService = {currentUser: {displayName: ''}};

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
				MatToolbarModule,
				MatFormFieldModule,
				MatSortModule,
				MatTableModule,
				MatCheckboxModule,
			],
			providers: [
				{provide: SessionService, useValue: sessionService},
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
