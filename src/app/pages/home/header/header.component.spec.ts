import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { HeaderComponent } from './header.component';
import { CapitalizeFirstPipe } from '../../../pipes/capitalize-first.pipe';
import { MatToolbarModule } from '@angular/material';
import { SessionService } from '../../../services';

describe('HeaderComponent', () => {
	const router = {navigate: jasmine.createSpy('navigate')};
	const sessionService = {currentUser: {displayName: ''}};

	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;


	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				HeaderComponent,
				CapitalizeFirstPipe,
			],
			providers: [
				{provide: SessionService, useValue: sessionService},
				{provide: Router, useValue: router},
			],
			imports: [MatToolbarModule]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
