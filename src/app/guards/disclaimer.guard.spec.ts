import { inject, TestBed } from '@angular/core/testing';

import { DisclaimerGuard } from './disclaimer.guard';

describe('DisclaimerGuard', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DisclaimerGuard]
		});
	});

	it('should ...', inject([DisclaimerGuard], (guard: DisclaimerGuard) => {
		expect(guard).toBeTruthy();
	}));
});
