import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { DisclaimerGuard } from './disclaimer.guard';
import { SessionService } from '../services';

describe('DisclaimerGuard', () => {
	const router = {navigate: jasmine.createSpy('navigate')};
	let disclaimerGuard: DisclaimerGuard;
	let sessionService: SessionService;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			providers: [
				DisclaimerGuard,
				SessionService,
				{provide: Router, useValue: router}
			],
		});
	});

	beforeEach(() => {
		disclaimerGuard = TestBed.get(DisclaimerGuard);
		sessionService = TestBed.get(SessionService);
	});

	it('should redirect to disclaimer if sessionService.isDisclaimerOk !== true', () => {
		sessionService.isDisclaimerAgreed = () => true;
		expect(disclaimerGuard.canActivate()).toBe(true);
	});

	it('should not redirect to disclaimer if sessionService.isDisclaimerOk === true', () => {
		sessionService.isDisclaimerAgreed = () => false;
		expect(disclaimerGuard.canActivate()).toBe(false);
	});

});
