import { inject, TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';
import { author } from '../_helper/mocks/jira';

describe('SessionService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SessionService]
		});
	});

	it('should be created', inject([SessionService], (service: SessionService) => {
		expect(service).toBeTruthy();
	}));

	describe('', () => {
		beforeEach(() => {
			sessionStorage.setItem('currentUser', JSON.stringify(author));

			TestBed.configureTestingModule({
				providers: [SessionService]
			});
		});

		it('should gather information from session/local storage at initialization', inject([SessionService], (service: SessionService) => {
			expect(service.currentUser).toEqual(author);
		}));
	});
});
