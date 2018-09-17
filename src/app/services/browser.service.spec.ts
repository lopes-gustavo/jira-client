import { inject, TestBed } from '@angular/core/testing';

import { BrowserService } from './browser.service';

describe('BrowserService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BrowserService]
		});
	});

	it('should be created', inject([BrowserService], (service: BrowserService) => {
		expect(service).toBeTruthy();
	}));
});
