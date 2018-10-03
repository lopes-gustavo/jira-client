import { inject, TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { SessionService } from '../services';

describe('AuthGuard', () => {
	const router = {navigate: jasmine.createSpy('navigate')};
	let authGuard: AuthGuard;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			providers: [
				AuthGuard,
				SessionService,
				{provide: Router, useValue: router}
			],
		});
	});

	beforeEach(() => {
		authGuard = TestBed.get(AuthGuard);
	});

	it('should not allow unlogged users to proceed', () => {
		expect(authGuard.canActivate()).toBe(false);
	});

	it('should allow logged users to proceed', inject([SessionService], (sessionService: SessionService) => {
		sessionService.currentUser = {} as any;
		expect(authGuard.canActivate()).toBe(true);
	}));

});
