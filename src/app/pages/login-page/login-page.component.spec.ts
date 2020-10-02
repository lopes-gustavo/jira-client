import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { LoginPageComponent } from './login-page.component';
import { ErrorComponent } from './error/error.component';
import { DebugElement } from '@angular/core';
import { ServerService } from '../../services';
import { asyncScheduler, throwError } from 'rxjs';

describe('LoginPageComponent', () => {
	const router = {navigate: jasmine.createSpy('navigate')};
	const serverService = {login: jasmine.createSpy('login')};

	let component: LoginPageComponent;
	let fixture: ComponentFixture<LoginPageComponent>;
	let loginDebug: DebugElement;
	let loginElement: HTMLElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				LoginPageComponent,
				ErrorComponent,
			],
			imports: [
				FormsModule,
				HttpClientModule,
				BrowserAnimationsModule,
				MatCardModule,
				MatFormFieldModule,
				MatInputModule,
				MatCheckboxModule,
			],
			providers: [
				{provide: Router, useValue: router},
				{provide: ServerService, useValue: serverService},
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginPageComponent);
		component = fixture.componentInstance;
		loginDebug = fixture.debugElement;
		loginElement = loginDebug.nativeElement;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#login should return a JIRA user', fakeAsync(() => {
		serverService.login.and.returnValue(throwError(new HttpErrorResponse({status: 400}), asyncScheduler));

		component.login({
			user: 'user',
			password: 'password',
			project: 'project',
			server: 'server',
			savePassword: false,
			clear: () => {
			}
		});

		expect(serverService.login).toHaveBeenCalledTimes(1);

		tick();
		fixture.detectChanges();

		expect(component.error).not.toBeNull();
		expect(component.error.status).toBe(400);

	}));
});
